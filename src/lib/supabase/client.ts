import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

let browserClient: SupabaseClient<Database> | null = null

/**
 * Lazily create the browser Supabase client.
 *
 * Important: This must NOT throw during build/SSR when env vars are missing.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (browserClient) return browserClient

  // Never create a browser client on the server/build.
  if (typeof window === 'undefined') return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return null

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return browserClient
}
