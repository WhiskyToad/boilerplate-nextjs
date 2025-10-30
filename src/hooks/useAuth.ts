'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useQueryClient } from '@tanstack/react-query'

export function useAuth() {
  const {
    user,
    session,
    loading,
    initialized,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: originalSignOut,
    resetPassword,
    initialize
  } = useAuthStore()

  const queryClient = useQueryClient()

  // Wrap signOut to clear cache
  const signOut = async () => {
    const result = await originalSignOut()
    queryClient.clear()
    return result
  }

  useEffect(() => {
    if (!initialized) {
      let cleanup: (() => void) | undefined

      const initializeAuth = async () => {
        const result = await initialize()
        if (typeof result === 'function') {
          cleanup = result
        }
      }

      initializeAuth()

      return () => {
        if (cleanup) {
          cleanup()
        }
      }
    }
  }, [initialized, initialize])

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword
  }
}