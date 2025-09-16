import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Processing Stripe webhook:', event.type)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id

    // Get user by Stripe customer ID
    const { data: userSub, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (fetchError || !userSub) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Determine tier from price ID
    const priceId = subscription.items.data[0]?.price?.id
    let tier = 'free'
    
    if (priceId?.includes('pro')) {
      tier = 'pro'
    } else if (priceId?.includes('teams')) {
      tier = 'teams'
    }

    // Determine billing interval
    const billingInterval = subscription.items.data[0]?.price?.recurring?.interval || null

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        tier,
        status: subscription.status,
        stripe_subscription_id: subscriptionId,
        billing_interval: billingInterval,
        current_period_start: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000).toISOString() : null,
        current_period_end: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userSub.user_id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
    } else {
      console.log(`Subscription updated for user ${userSub.user_id}: ${tier}`)
    }
  } catch (error) {
    console.error('Error in handleSubscriptionChange:', error)
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string

    // Get user by Stripe customer ID
    const { data: userSub, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (fetchError || !userSub) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Update subscription status to canceled
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        tier: 'free',
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userSub.user_id)

    if (updateError) {
      console.error('Error canceling subscription:', updateError)
    } else {
      console.log(`Subscription canceled for user ${userSub.user_id}`)
    }
  } catch (error) {
    console.error('Error in handleSubscriptionCancellation:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string

    // Get user by Stripe customer ID
    const { data: userSub, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (fetchError || !userSub) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Update subscription status to active
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userSub.user_id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
    } else {
      console.log(`Payment succeeded for user ${userSub.user_id}`)
    }
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string

    // Get user by Stripe customer ID
    const { data: userSub, error: fetchError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (fetchError || !userSub) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Update subscription status to past_due
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userSub.user_id)

    if (updateError) {
      console.error('Error updating payment failed status:', updateError)
    } else {
      console.log(`Payment failed for user ${userSub.user_id}`)
    }
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error)
  }
}