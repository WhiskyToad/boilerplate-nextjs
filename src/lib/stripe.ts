import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

// Build-time safe: only instantiate when configured
export const stripe =
  secretKey
    ? new Stripe(secretKey, {
        apiVersion: '2025-07-30.basil',
        typescript: true,
      })
    : null;

export const isStripeConfigured = () =>
  Boolean(secretKey && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const getStripeInstance = () => stripe;
