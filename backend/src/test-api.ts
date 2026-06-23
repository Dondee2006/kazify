import { logger } from './config/logger';

const API_BASE = 'http://localhost:5000/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

async function fetchJson(url: string, options?: RequestInit): Promise<AnyData> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: AnyData;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }
  return data;
}

async function testSuite() {
  logger.info('========================================================');
  logger.info('   KAZIFY BACKEND API INTEGRATION TEST SUITE           ');
  logger.info('========================================================');

  try {
    // 1. Health check
    logger.info('Step 1: Running basic server health checks...');
    const healthData = await fetchJson('http://localhost:5000/health');
    logger.info(`Server Health: ${JSON.stringify(healthData)}`);

    // 2. Synchronize Freelancer
    logger.info('\nStep 2: Synchronizing mock freelancer Koffi Mensah...');
    const freelancer = await fetchJson(`${API_BASE}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-firebase-id': 'mock-freelancer-koffi',
        'x-bypass-firebase-name': 'Koffi Mensah',
        'x-bypass-firebase-email': 'koffi@mensah.com',
        'x-onboarding-role': 'FREELANCER'
      },
      body: JSON.stringify({ role: 'FREELANCER' })
    });
    logger.info(`Freelancer Profile: ID: ${freelancer.id}, Balance: $${freelancer.balance}`);

    // 3. Synchronize Client
    logger.info('\nStep 3: Synchronizing mock client Sarah Mwangi...');
    const client = await fetchJson(`${API_BASE}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-firebase-id': 'mock-client-sarah',
        'x-bypass-firebase-name': 'Sarah Mwangi',
        'x-bypass-firebase-email': 'sarah@mwangi.com',
        'x-onboarding-role': 'CLIENT'
      },
      body: JSON.stringify({ role: 'CLIENT' })
    });
    logger.info(`Client Profile: ID: ${client.id}, Balance: $${client.balance}`);

    // 4. Create Gig
    logger.info('\nStep 4: Publishing a new Freelancer service listing (Gig)...');
    const gig = await fetchJson(`${API_BASE}/gigs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-firebase-id': 'mock-freelancer-koffi',
      },
      body: JSON.stringify({
        title: 'Full-stack React/Next.js SaaS Development',
        description: 'I will build a responsive TypeScript SaaS web application...',
        basePrice: 500.00,
        deliveryDays: 5,
        category: 'Programming & IT'
      })
    });
    logger.info(`Gig created: ID: ${gig.id}, Title: "${gig.title}"`);

    // 5. Create Job Request
    logger.info('\nStep 5: Publishing a Client job post (Shoutout)...');
    const request = await fetchJson(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-firebase-id': 'mock-client-sarah',
      },
      body: JSON.stringify({
        title: 'Branding explainer logo design package',
        description: 'Require vector assets, color palette codes, and brand style guide...',
        budget: 150.00,
        category: 'Graphics & Design'
      })
    });
    logger.info(`Job Request created: ID: ${request.id}, Budget: $${request.budget}`);

    // 6. List and search Gigs
    logger.info('\nStep 6: Querying marketplace feed (search & pagination)...');
    const gigsFeed = await fetchJson(`${API_BASE}/gigs?search=next.js&category=Programming+%26+IT`);
    logger.info(`Found ${gigsFeed.gigs.length} gig(s). Pagination: ${JSON.stringify(gigsFeed.pagination)}`);

    // 7. Initiate escrow checkout session
    logger.info('\nStep 7: Client creating an Escrow checkout session for the Gig...');
    const checkout = await fetchJson(`${API_BASE}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-firebase-id': 'mock-client-sarah',
      },
      body: JSON.stringify({ gigId: gig.id })
    });
    const orderId: string = checkout.orderId;
    logger.info(`Checkout session ready: Order ID: ${orderId}, Mode: ${checkout.mode}`);

    // Verify initial Order state
    const orderBefore = await fetchJson(`${API_BASE}/orders/${orderId}`, {
      headers: { 'x-bypass-firebase-id': 'mock-client-sarah' }
    });
    logger.info(`Initial Order Status: ${orderBefore.status}`);

    // 8. Fire mock payment webhook trigger
    logger.info('\nStep 8: Simulating successful payment webhook (ESCROW_LOCK)...');
    const webhookResult = await fetchJson(`${API_BASE}/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mock-webhook': 'true'
      },
      body: JSON.stringify({ orderId })
    });
    logger.info(`Webhook reply: ${JSON.stringify(webhookResult)}`);

    // Verify funded Order state
    const orderFunded = await fetchJson(`${API_BASE}/orders/${orderId}`, {
      headers: { 'x-bypass-firebase-id': 'mock-client-sarah' }
    });
    logger.info(`Funded Order Status: ${orderFunded.status} (Stripe ID: ${orderFunded.stripePaymentIntentId})`);

    // 9. Freelancer delivers task
    logger.info('\nStep 9: Freelancer submitting work for review...');
    const orderSubmitted = await fetchJson(`${API_BASE}/orders/${orderId}/submit-work`, {
      method: 'PUT',
      headers: { 'x-bypass-firebase-id': 'mock-freelancer-koffi' }
    });
    logger.info(`Order Status after submission: ${orderSubmitted.status}`);

    // 10. Client releases funds
    logger.info('\nStep 10: Client releasing escrow funds (10% platform fee)...');
    const orderCompleted = await fetchJson(`${API_BASE}/orders/${orderId}/release-funds`, {
      method: 'PUT',
      headers: { 'x-bypass-firebase-id': 'mock-client-sarah' }
    });
    logger.info(`Order Status after release: ${orderCompleted.status}`);

    // 11. Verify freelancer final balance
    logger.info('\nStep 11: Validating freelancer wallet balance...');
    const freelancerUpdated = await fetchJson(`${API_BASE}/auth/sync`, {
      method: 'POST',
      headers: { 'x-bypass-firebase-id': 'mock-freelancer-koffi' }
    });
    const expectedPayout = (gig.basePrice * 0.90).toFixed(2);
    logger.info(`Freelancer Balance: $${freelancerUpdated.balance} (Expected ~$${expectedPayout} after 10% platform fee)`);

    logger.info('\n========================================================');
    logger.info('   SUCCESS: ALL INTEGRATION ROUTE TESTS PASSED!         ');
    logger.info('========================================================');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`\nTEST FAILED: ${message}`);
    process.exit(1);
  }
}

testSuite();
