import { createBrowserClient } from '@supabase/ssr'

//USE IN CLIENT COMPONENTS
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
    auth: {
      persistSession: true, // Ensures token is stored in cookies
      autoRefreshToken: true, // Keeps session fresh
    },}
  )
  
}

export const supabase = createClient()