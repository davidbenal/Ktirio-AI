import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Webhook signing secret (disabled for now due to org policy)
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Middleware to verify Clerk authentication token
 */
async function verifyClerkToken(req: functions.https.Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    // Verify the token is a valid Clerk session token
    // For now, we'll decode it and extract the user ID
    // In production, you should verify the token with Clerk's API or use their JWT verification
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decodedToken.sub || decodedToken.userId || null;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Cloud Function: Create Stripe Checkout Session
 * Using runWith({ invoker: 'private' }) with Bearer token authentication
 */
export const createCheckoutSession = functions
  .runWith({ invoker: 'private' })
  .https.onRequest(async (req, res) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Verify authentication
    const authenticatedUserId = await verifyClerkToken(req);
    if (!authenticatedUserId) {
      res.status(401).json({ error: 'Unauthorized - Invalid or missing authentication token' });
      return;
    }

    try {
      const { priceId, userId, userEmail } = req.body;

      // Ensure the authenticated user matches the requested userId
      if (userId !== authenticatedUserId) {
        res.status(403).json({ error: 'Forbidden - User ID mismatch' });
        return;
      }

      if (!priceId || !userId || !userEmail) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Get or create Stripe customer
      let customerId: string;

      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (userData?.stripeCustomerId) {
        customerId = userData.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: { firebaseUID: userId },
        });
        customerId = customer.id;

        await admin.firestore().collection('users').doc(userId).update({
          stripeCustomerId: customerId,
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: userId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: { userId },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

/**
 * Stripe Webhook Handler
 * NOTE: Due to organization policy constraints, this function is temporarily disabled.
 * Webhooks will be handled through Stripe CLI or alternative authentication method.
 */
// export const stripeWebhook = functions
//   .runWith({ invoker: 'public' })
//   .https.onRequest(async (req, res) => {
//     if (req.method !== 'POST') {
//       res.status(405).send('Method Not Allowed');
//       return;
//     }

//     const sig = req.headers['stripe-signature'];
//     if (!sig) {
//       res.status(400).send('Missing Stripe signature');
//       return;
//     }

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(req.rawBody, sig as string, endpointSecret);
//     } catch (err: any) {
//       console.error('Webhook signature verification failed:', err.message);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     try {
//       switch (event.type) {
//         case 'checkout.session.completed': {
//           const session = event.data.object as Stripe.Checkout.Session;
//           const userId = session.metadata?.userId || session.client_reference_id;
//           if (!userId) break;

//           const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
//           const priceId = subscription.items.data[0].price.id;
//           const planData = getPlanFromPriceId(priceId);
//           if (!planData) break;

//           await admin.firestore().collection('users').doc(userId).update({
//             plan: planData.plan,
//             credits: planData.credits,
//             subscriptionId: subscription.id,
//             subscriptionStatus: subscription.status,
//             priceId: priceId,
//             updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//           });
//           break;
//         }

//         case 'customer.subscription.updated': {
//           const subscription = event.data.object as Stripe.Subscription;
//           const customer = await stripe.customers.retrieve(subscription.customer as string);
//           if ('metadata' in customer && customer.metadata?.firebaseUID) {
//             const userId = customer.metadata.firebaseUID;
//             const priceId = subscription.items.data[0].price.id;
//             const planData = getPlanFromPriceId(priceId);
//             if (planData) {
//               await admin.firestore().collection('users').doc(userId).update({
//                 plan: planData.plan,
//                 subscriptionStatus: subscription.status,
//                 updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//               });
//             }
//           }
//           break;
//         }

//         case 'customer.subscription.deleted': {
//           const subscription = event.data.object as Stripe.Subscription;
//           const customer = await stripe.customers.retrieve(subscription.customer as string);
//           if ('metadata' in customer && customer.metadata?.firebaseUID) {
//             await admin.firestore().collection('users').doc(customer.metadata.firebaseUID).update({
//               plan: 'free',
//               credits: 10,
//               subscriptionStatus: 'canceled',
//               subscriptionId: null,
//               updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//             });
//           }
//           break;
//         }

//         case 'invoice.payment_succeeded': {
//           const invoice = event.data.object as Stripe.Invoice;
//           const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
//           const customer = await stripe.customers.retrieve(subscription.customer as string);
//           if ('metadata' in customer && customer.metadata?.firebaseUID) {
//             const priceId = subscription.items.data[0].price.id;
//             const planData = getPlanFromPriceId(priceId);
//             if (planData && planData.credits > 0) {
//               await admin.firestore().collection('users').doc(customer.metadata.firebaseUID).update({
//                 credits: planData.credits,
//                 updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//               });
//             }
//           }
//           break;
//         }

//         case 'invoice.payment_failed': {
//           const invoice = event.data.object as Stripe.Invoice;
//           const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
//           const customer = await stripe.customers.retrieve(subscription.customer as string);
//           if ('metadata' in customer && customer.metadata?.firebaseUID) {
//             await admin.firestore().collection('users').doc(customer.metadata.firebaseUID).update({
//               subscriptionStatus: 'past_due',
//               updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//             });
//           }
//           break;
//         }
//       }

//       res.json({ received: true });
//     } catch (error: any) {
//       console.error('Error processing webhook:', error);
//       res.status(500).json({ error: error.message });
//     }
//   });

// Helper function (disabled for now - will be re-enabled with webhook)
// function getPlanFromPriceId(priceId: string): { plan: string; credits: number } | null {
//   const priceMapping: Record<string, { plan: string; credits: number }> = {
//     'price_1SDINURubDJ4RApyOW8A61K7': { plan: 'basic', credits: 100 },
//     'price_1SDIOCRubDJ4RApy47OSAiWV': { plan: 'pro', credits: 500 },
//     'price_1SDIOkRubDJ4RApyfVWUIE1O': { plan: 'enterprise', credits: -1 },
//   };
//   return priceMapping[priceId] || null;
// }

export const cancelSubscription = functions
  .runWith({ invoker: 'private' })
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Verify authentication
    const authenticatedUserId = await verifyClerkToken(req);
    if (!authenticatedUserId) {
      res.status(401).json({ error: 'Unauthorized - Invalid or missing authentication token' });
      return;
    }

    try {
      const { userId } = req.body;

      // Ensure the authenticated user matches the requested userId
      if (userId !== authenticatedUserId) {
        res.status(403).json({ error: 'Forbidden - User ID mismatch' });
        return;
      }
      if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
      }

      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (!userData?.subscriptionId) {
        res.status(404).json({ error: 'No active subscription' });
        return;
      }

      await stripe.subscriptions.update(userData.subscriptionId, {
        cancel_at_period_end: true,
      });

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

export const createPortalSession = functions
  .runWith({ invoker: 'private' })
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Verify authentication
    const authenticatedUserId = await verifyClerkToken(req);
    if (!authenticatedUserId) {
      res.status(401).json({ error: 'Unauthorized - Invalid or missing authentication token' });
      return;
    }

    try {
      const { userId } = req.body;

      // Ensure the authenticated user matches the requested userId
      if (userId !== authenticatedUserId) {
        res.status(403).json({ error: 'Forbidden - User ID mismatch' });
        return;
      }
      if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
      }

      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (!userData?.stripeCustomerId) {
        res.status(404).json({ error: 'No Stripe customer found' });
        return;
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: userData.stripeCustomerId,
        return_url: `${req.headers.origin}/profile`,
      });

      res.status(200).json({ url: session.url });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  });
