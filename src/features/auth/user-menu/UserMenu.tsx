'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

interface UserMenuProps {
  className?: string
}

export function UserMenu({ className = '' }: UserMenuProps) {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
          <span className="text-sm font-medium">
            {user.email?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
      </div>
      
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li className="menu-title">
          <span>{user.email}</span>
        </li>
        <li>
          <Link href={ROUTES.app.home}>App Home</Link>
        </li>
        <li>
          <Link href={ROUTES.settings}>Settings</Link>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </li>
      </ul>
    </div>
  )
}
