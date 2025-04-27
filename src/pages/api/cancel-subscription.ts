import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/features/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get user from Supabase auth
  const supabase = createClient(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { subscriptionId } = req.body;

  if (!subscriptionId) {
    return res.status(400).json({ error: "Subscription ID is required" });
  }

  try {
    // Verify this subscription belongs to the current user
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("stripe_subscription_id", subscriptionId)
      .single();

    if (!subscription) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Cancel subscription at period end
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update subscription in database
    await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}