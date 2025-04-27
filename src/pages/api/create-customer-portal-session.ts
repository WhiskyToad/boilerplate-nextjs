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

  try {
    // Get user's subscription from database
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return res.status(400).json({ error: "No Stripe customer found" });
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${req.headers.origin}/account?tab=subscription`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}