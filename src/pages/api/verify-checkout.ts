import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing session ID' });
  }

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Here you would typically update your database to mark the user as subscribed
    // For example: await updateUserSubscription(userId, session.subscription);
    
    return res.status(200).json({
      success: true,
      session: {
        customer: session.customer,
        subscription: session.subscription,
        planType: session.metadata?.planType,
      },
    });
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, error: errorMessage });
  }
}