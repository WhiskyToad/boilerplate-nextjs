'use client'

import { useState } from 'react'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Button } from '@/components/ui/button/Button'

export interface FilterBarProps {
  children: React.ReactNode
  onClearAll?: () => void
  activeFiltersCount?: number
  className?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function FilterBar({
  children,
  onClearAll,
  activeFiltersCount = 0,
  className = '',
  collapsible = false,
  defaultCollapsed = false
}: FilterBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`bg-base-100 border border-base-300 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-base-content/70" />
            <span className="font-medium">Filters</span>
          </div>
          
          {activeFiltersCount > 0 && (
            <div className="badge badge-primary badge-sm">
              {activeFiltersCount}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && onClearAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="gap-1"
            >
              <FiX className="w-3 h-3" />
              Clear All
            </Button>
          )}
          
          {collapsible && (
            <button
              onClick={toggleCollapsed}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
            >
              {isCollapsed ? (
                <FiChevronDown className="w-4 h-4" />
              ) : (
                <FiChevronUp className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// Filter summary component
export interface FilterSummaryProps {
  filters: Array<{
    label: string
    value: string
    onRemove: () => void
  }>
  onClearAll?: () => void
  className?: string
}

export function FilterSummary({
  filters,
  onClearAll,
  className = ''
}: FilterSummaryProps) {
  if (filters.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-base-content/70">Active filters:</span>
      
      {filters.map((filter, index) => (
        <div
          key={index}
          className="badge badge-outline gap-2 py-2 px-3"
        >
          <span className="text-xs">
            <strong>{filter.label}:</strong> {filter.value}
          </span>
          <button
            onClick={filter.onRemove}
            className="text-base-content/60 hover:text-base-content"
            aria-label={`Remove ${filter.label} filter`}
          >
            <FiX className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {filters.length > 1 && onClearAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="gap-1"
        >
          <FiX className="w-3 h-3" />
          Clear All
        </Button>
      )}
    </div>
  )
}