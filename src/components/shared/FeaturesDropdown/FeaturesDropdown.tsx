'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiSun, FiMoon, FiTrendingUp, FiHeart, FiCalendar, FiBook, FiChevronDown } from 'react-icons/fi'

const features = [
  {
    id: 'morning-prompts',
    name: 'Morning Prompts',
    icon: FiSun,
    description: 'Start your day with gratitude and intention-setting prompts',
    href: '/#features',
    color: 'text-warning',
  },
  {
    id: 'evening-reflection',
    name: 'Evening Reflection',
    icon: FiMoon,
    description: 'End your day celebrating wins and lessons learned',
    href: '/#features',
    color: 'text-info',
  },
  {
    id: 'habit-tracking',
    name: 'Habit Tracking',
    icon: FiTrendingUp,
    description: 'Build positive habits and track your progress over time',
    href: '/#features',
    color: 'text-success',
  },
  {
    id: 'gratitude-practice',
    name: 'Gratitude Practice',
    icon: FiHeart,
    description: 'Daily gratitude exercises proven to boost happiness',
    href: '/#features',
    color: 'text-error',
  },
  {
    id: 'streak-tracking',
    name: 'Streak Tracking',
    icon: FiCalendar,
    description: 'Stay motivated with daily streaks and consistency metrics',
    href: '/#features',
    color: 'text-primary',
  },
  {
    id: 'journal-history',
    name: 'Journal History',
    icon: FiBook,
    description: 'Search and reflect on past entries to track your growth',
    href: '/#features',
    color: 'text-base-content/60',
  },
]

export function FeaturesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  let closeTimeout: NodeJS.Timeout

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsOpen(false)
      setHoveredFeature(null)
    }, 150)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1">
        Features
        <FiChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Bento Grid */}
          <div className="grid grid-cols-3 gap-3">
            {features.map((feature) => (
              <Link
                key={feature.id}
                href={feature.href}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative group block p-4 rounded-xl border transition-all duration-200 ${
                  hoveredFeature === feature.id
                    ? 'border-primary/30 bg-primary/5 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`text-3xl mb-3 ${feature.color}`}>
                  <feature.icon />
                </div>

                {/* Name */}
                <div className="font-bold text-sm text-gray-900 mb-2">
                  {feature.name}
                </div>

                {/* Description */}
                <div className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/#features"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all features →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
