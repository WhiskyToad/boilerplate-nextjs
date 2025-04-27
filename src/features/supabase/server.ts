import { createServerClient } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export const createClient = (req: NextApiRequest, res: NextApiResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = req.headers.cookie || "";
          return Object.entries(parse(cookieHeader)).map(([name, value]) => ({ name, value: value || "" }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) => {
              res.setHeader("Set-Cookie", `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax`);
            });
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        },
      },
    }
  );
};
