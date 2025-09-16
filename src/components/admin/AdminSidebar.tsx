'use client'

import { 
  FiHome, 
  FiUsers, 
  FiCreditCard, 
  FiBarChart, 
  FiSettings,
  FiShield
} from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { label: 'Overview', href: '/admin', icon: FiHome },
  { label: 'Users', href: '/admin/users', icon: FiUsers },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: FiCreditCard },
  { label: 'Analytics', href: '/admin/analytics', icon: FiBarChart },
  { label: 'Security', href: '/admin/security', icon: FiShield },
  { label: 'Settings', href: '/admin/settings', icon: FiSettings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-base-200 min-h-[calc(100vh-4rem)] border-r border-base-300">
      <nav className="p-4">
        <ul className="menu">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`gap-3 ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}