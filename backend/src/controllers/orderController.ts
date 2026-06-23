import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import { logger } from '../config/logger';

const PLATFORM_FEE_PERCENT = 0.10; // 10% platform fee

export async function getOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return orders where user is client or freelancer
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { clientId: user.id },
          { freelancerId: user.id }
        ]
      },
      include: {
        gig: true,
        jobRequest: true,
        client: { select: { id: true, name: true, email: true } },
        freelancer: { select: { id: true, name: true, email: true } }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json(orders);
  } catch (error: any) {
    logger.error(`Error in getOrders controller: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve orders' });
  }
}

export async function getOrderById(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        gig: true,
        jobRequest: true,
        client: { select: { id: true, name: true, email: true } },
        freelancer: { select: { id: true, name: true, email: true } },
        transactions: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Access control check
    if (order.clientId !== user.id && order.freelancerId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have permissions to access this order.' });
    }

    return res.json(order);
  } catch (error: any) {
    logger.error(`Error in getOrderById: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve order details' });
  }
}

export async function submitWork(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.freelancerId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: Only the assigned freelancer can submit work.' });
    }

    if (order.status !== 'ESCROW_HELD' && order.status !== 'IN_PROGRESS') {
      return res.status(400).json({ error: `Action Error: Cannot submit work for an order in status: ${order.status}` });
    }

    logger.info(`Freelancer ${user.id} submitting work for order ${order.id}`);
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'UNDER_REVIEW',
        updatedAt: new Date()
      }
    });

    return res.json(updatedOrder);
  } catch (error: any) {
    logger.error(`Error in submitWork: ${error.message}`);
    return res.status(500).json({ error: 'Failed to submit work assignment' });
  }
}

export async function releaseFunds(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.clientId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: Only the client can authorize funds disbursement.' });
    }

    if (order.status !== 'ESCROW_HELD' && order.status !== 'UNDER_REVIEW' && order.status !== 'IN_PROGRESS') {
      return res.status(400).json({ error: `Action Error: Funds cannot be released from an order in status: ${order.status}` });
    }

    const totalAmount = Number(order.amount);
    const platformFee = totalAmount * PLATFORM_FEE_PERCENT;
    const netPayout = totalAmount - platformFee;

    logger.info(`Disbursing payout for Order ${order.id}. Total: $${totalAmount}, Fee: $${platformFee}, Net: $${netPayout}`);

    // Execute atomic transaction for disbursement
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Transition Order status to COMPLETED
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date()
        }
      });

      // 2. Increment freelancer balance
      await tx.user.update({
        where: { id: order.freelancerId },
        data: {
          balance: { increment: netPayout }
        }
      });

      // 3. Log escrow release transaction ledger audit entry
      await tx.transaction.create({
        data: {
          userId: order.freelancerId,
          amount: netPayout,
          type: 'ESCROW_RELEASE',
          orderId: order.id
        }
      });

      return ord;
    });

    return res.json(updatedOrder);
  } catch (error: any) {
    logger.error(`Error in releaseFunds: ${error.message}`);
    return res.status(500).json({ error: 'Failed to release escrow disbursements' });
  }
}
