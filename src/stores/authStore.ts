'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { posthog } from '@/lib/posthog'
import { analytics } from '@/lib/analytics-service'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  signUp: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  initialize: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // State
      user: null,
      session: null,
      loading: true,
      initialized: false,

      // Actions
      setUser: (user) => set({ user }, false, 'setUser'),
      setSession: (session) => set({ session }, false, 'setSession'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      setInitialized: (initialized) => set({ initialized }, false, 'setInitialized'),

      signUp: async (email, password, options) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
            ...options
          }
        })
        return { error }
      },

      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        return { error }
      },

      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        return { error }
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
      },

      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        })
        return { error }
      },

      initialize: async () => {
        const { setUser, setSession, setLoading, setInitialized } = get()
        
        try {
          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) {
            console.error('Error getting session:', error)
          } else {
            setSession(session)
            setUser(session?.user ?? null)
            
            // Identify user in PostHog for initial session
            if (session?.user && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
              try {
                console.log('PostHog: Identifying initial user:', session.user.id)
                posthog.identify(session.user.id, {
                  email: session.user.email,
                  created_at: session.user.created_at,
                })
              } catch (error) {
                console.error('PostHog initial identify error:', error)
              }
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
        } finally {
          setLoading(false)
          setInitialized(true)
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.id)
            
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            
            // Identify user in PostHog when signed in
            if (session?.user && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
              try {
                console.log('PostHog: Identifying user:', session.user.id)
                posthog.identify(session.user.id, {
                  email: session.user.email,
                  created_at: session.user.created_at,
                })
                // Track sign in event
                if (event === 'SIGNED_IN') {
                  posthog.capture('user_signed_in', {
                    provider: session.user.app_metadata?.provider || 'email'
                  })
                }
              } catch (error) {
                console.error('PostHog identify error:', error)
              }
            }
            
            // Reset PostHog user when signed out
            if (event === 'SIGNED_OUT' && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
              try {
                console.log('PostHog: Resetting user on sign out')
                posthog.reset()
              } catch (error) {
                console.error('PostHog reset error:', error)
              }
            }
          }
        )

        // Return cleanup function
        return () => subscription.unsubscribe()
      }
    }),
    {
      name: 'auth-store',
    }
  )
)