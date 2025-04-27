"use server"
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/features/supabase/server";
import type {  NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchParams } = new URL(req.url ?? "", `http://${req.headers.host}`);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";


  if (token_hash && type) {
    const supabase = createClient(req, res);


    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      res.redirect(next);
    }
  }
  res.redirect("/error");
}
