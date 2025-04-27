import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const sig = req.headers["stripe-signature"]!;
  const buf = await buffer(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  const obj = event.data.object;

  switch (event.type) {
    case "invoice.payment_succeeded":
      {
        const invoice = obj as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details?.subscription as string;
        const customerId = invoice.customer as string;

        // Get the Checkout Session to access metadata
        const session = await stripe.checkout.sessions.list({
          customer: customerId,
          limit: 1,
        });

        const metadata = session.data?.[0]?.metadata;
        const userId = metadata?.userId;
        const planType = metadata?.planType;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        let currentPeriodEnd;
        if (subscription.latest_invoice) {
          const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
          currentPeriodEnd = new Date(invoice.lines.data[0].period.end * 1000);
        }
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: planType,
            status: subscription.status,
            current_period_end: currentPeriodEnd,
          },
          {
            onConflict: "user_id",
          }
        );
        
      }
      break;

    case "customer.subscription.deleted":
      {
        const subscription = obj as Stripe.Subscription;
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            updated_at: new Date(),
          })
          .eq("stripe_subscription_id", subscription.id);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}
