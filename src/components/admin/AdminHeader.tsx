'use client'

import { FiUser, FiLogOut, FiHome } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export function AdminHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-primary text-primary-content shadow-lg">
      <div className="navbar px-6">
        <div className="flex-1">
          <Link href="/admin" className="text-xl font-bold">
            Admin Panel
          </Link>
        </div>
        
        <div className="flex-none gap-2">
          <Link 
            href="/dashboard" 
            className="btn btn-ghost btn-sm gap-2"
          >
            <FiHome className="w-4 h-4" />
            Back to App
          </Link>
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
              <FiUser className="w-4 h-4" />
              {user?.email}
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-52 border border-base-300">
              <li>
                <button 
                  onClick={() => signOut()}
                  className="gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}