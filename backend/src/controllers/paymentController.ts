import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import { logger } from '../config/logger';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialize stripe conditionally
let stripe: Stripe | null = null;
if (stripeSecret && stripeSecret !== 'sk_test_mock') {
  stripe = new Stripe(stripeSecret, {
    apiVersion: '2023-10-16' as any,
  });
}

export async function createCheckoutSession(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { gigId, jobRequestId, freelancerId } = req.body;

    if (!gigId && !jobRequestId) {
      return res.status(400).json({ error: 'Validation Error: Either gigId or jobRequestId is required.' });
    }

    let amount = 0;
    let finalFreelancerId = '';
    let description = '';

    if (gigId) {
      const gig = await prisma.gig.findUnique({
        where: { id: gigId },
        include: { freelancer: true }
      });
      if (!gig) {
        return res.status(404).json({ error: 'Gig not found.' });
      }
      amount = Number(gig.basePrice);
      finalFreelancerId = gig.freelancerId;
      description = `Escrow funding for Gig: "${gig.title}"`;
    } else if (jobRequestId) {
      const request = await prisma.jobRequest.findUnique({
        where: { id: jobRequestId }
      });
      if (!request) {
        return res.status(404).json({ error: 'Job Request not found.' });
      }
      if (!freelancerId) {
        return res.status(400).json({ error: 'Validation Error: freelancerId must be specified to hire for a job request.' });
      }
      amount = Number(request.budget);
      finalFreelancerId = freelancerId;
      description = `Escrow funding for Job Request: "${request.title}"`;
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Validation Error: Escrow amount must be greater than zero.' });
    }

    // Initialize Order in database set to PENDING_ESCROW
    const order = await prisma.order.create({
      data: {
        gigId: gigId || null,
        jobRequestId: jobRequestId || null,
        clientId: user.id,
        freelancerId: finalFreelancerId,
        amount: amount,
        status: 'PENDING_ESCROW',
        stripePaymentIntentId: 'pending'
      }
    });

    logger.info(`Initialized order ${order.id} with status PENDING_ESCROW`);

    // Stripe checkout integration
    if (stripe) {
      logger.info(`Creating live Stripe checkout session for Order: ${order.id}`);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: gigId ? 'Kazify Gig Purchase' : 'Kazify Job Hire',
                description,
              },
              unit_amount: Math.round(amount * 100), // convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host') || 'localhost:3000'}/order-simulation/${order.id}?status=success`,
        cancel_url: `${req.protocol}://${req.get('host') || 'localhost:3000'}/order-simulation/${order.id}?status=cancelled`,
        metadata: {
          orderId: order.id,
          clientId: user.id,
          freelancerId: finalFreelancerId,
        },
      });

      return res.json({
        sessionId: session.id,
        checkoutUrl: session.url,
        orderId: order.id,
        mode: 'stripe'
      });
    } else {
      // Offline/mock checkout url response
      logger.warn(`Stripe API is not configured or in mock mode. Returning simulated checkout URL.`);
      const mockCheckoutUrl = `/order-simulation/${order.id}?status=simulation`;
      return res.json({
        checkoutUrl: mockCheckoutUrl,
        orderId: order.id,
        mode: 'mock'
      });
    }
  } catch (error: any) {
    logger.error(`Error in createCheckoutSession: ${error.message}`);
    return res.status(500).json({ error: 'Failed to initialize payment workflow' });
  }
}

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event | null = null;

  try {
    if (stripe && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } else {
      // Support simulation payloads for testing endpoints offline
      const mockEventHeader = req.headers['x-mock-webhook'] as string;
      if (mockEventHeader === 'true') {
        const { orderId } = req.body;
        if (!orderId) {
          return res.status(400).json({ error: 'Mock Verification Error: missing orderId in body.' });
        }
        await processSuccessfulEscrow(orderId, 'mock_payment_intent_id');
        return res.json({ received: true, status: 'simulated_success' });
      }

      return res.status(400).json({ error: 'Webhook Error: Missing Stripe signature or mock triggers.' });
    }

    // Process real Stripe Webhooks
    if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
      let orderId = '';
      let paymentIntentId = '';

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        orderId = paymentIntent.metadata.orderId;
        paymentIntentId = paymentIntent.id;
      } else {
        const session = event.data.object as Stripe.Checkout.Session;
        orderId = session.metadata?.orderId || '';
        paymentIntentId = session.payment_intent as string || 'session_completed';
      }

      if (orderId) {
        await processSuccessfulEscrow(orderId, paymentIntentId);
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    logger.error(`Stripe Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

async function processSuccessfulEscrow(orderId: string, paymentIntentId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      logger.error(`Webhook Event: Order ${orderId} not found in database.`);
      return;
    }

    if (order.status !== 'PENDING_ESCROW') {
      logger.warn(`Webhook Event: Order ${orderId} is already in state: ${order.status}`);
      return;
    }

    // Transition Order status to ESCROW_HELD, store paymentIntent, and log audit transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update Order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'ESCROW_HELD',
          stripePaymentIntentId: paymentIntentId,
          updatedAt: new Date()
        }
      });

      // 2. Lock client funds inside Transaction ledger
      await tx.transaction.create({
        data: {
          userId: order.clientId,
          amount: order.amount, // Lock positive amount in transaction history
          type: 'ESCROW_LOCK',
          orderId: order.id
        }
      });

      logger.info(`Order ${orderId} successfully funded! Status changed to ESCROW_HELD.`);
    });
  } catch (error: any) {
    logger.error(`Failed processing successful escrow for order ${orderId}: ${error.message}`);
    throw error;
  }
}
