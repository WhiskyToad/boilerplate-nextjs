import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeInstance, isStripeConfigured } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable billing.' },
        { status: 503 }
      );
    }

    const stripe = getStripeInstance();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe client unavailable. Verify STRIPE_SECRET_KEY configuration.' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Set up user_subscriptions table in Supabase
    // For now, this endpoint will create a customer if needed

    // Try to find existing subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // If no customer exists, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Store customer ID (will fail if table doesn't exist, which is expected)
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          tier: 'free',
          status: 'active',
        });
    }

    // Create Stripe Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.nextUrl.origin}/settings`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe billing portal error:', error);

    // Check if error is due to missing table
    if (error instanceof Error && error.message.includes('relation')) {
      return NextResponse.json(
        {
          error: 'Subscription system not set up yet. Please configure user_subscriptions table in Supabase.',
          details: 'Run the subscription migration to enable billing features.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
