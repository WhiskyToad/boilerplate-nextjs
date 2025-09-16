'use client'

import { useState } from 'react'
import { FiCalendar, FiX } from 'react-icons/fi'
import { Input } from '@/components/ui/input/Input'

export interface DateRange {
  startDate?: string
  endDate?: string
}

export interface DateRangeFilterProps {
  label: string
  value: DateRange
  onChange: (range: DateRange) => void
  onClear?: () => void
  className?: string
  placeholder?: {
    start?: string
    end?: string
  }
}

export function DateRangeFilter({
  label,
  value,
  onChange,
  onClear,
  className = '',
  placeholder = {
    start: 'Start date',
    end: 'End date'
  }
}: DateRangeFilterProps) {
  const hasValue = value.startDate || value.endDate

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      startDate: e.target.value
    })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: e.target.value
    })
  }

  const handleClear = () => {
    onChange({ startDate: undefined, endDate: undefined })
    onClear?.()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-medium flex items-center gap-2">
          <FiCalendar className="w-4 h-4" />
          {label}
        </span>
        {hasValue && onClear && (
          <button
            type="button"
            onClick={handleClear}
            className="label-text-alt text-base-content/60 hover:text-base-content flex items-center gap-1 transition-colors"
          >
            <FiX className="w-3 h-3" />
            Clear
          </button>
        )}
      </label>
      
      <div className="flex gap-2">
        <Input
          type="date"
          value={value.startDate || ''}
          onChange={handleStartDateChange}
          placeholder={placeholder.start}
          className="flex-1"
        />
        <span className="flex items-center text-base-content/60">to</span>
        <Input
          type="date"
          value={value.endDate || ''}
          onChange={handleEndDateChange}
          placeholder={placeholder.end}
          className="flex-1"
          min={value.startDate} // End date cannot be before start date
        />
      </div>
      
      {hasValue && (
        <div className="label">
          <span className="label-text-alt text-base-content/60">
            {value.startDate && formatDate(value.startDate)}
            {value.startDate && value.endDate && ' - '}
            {value.endDate && formatDate(value.endDate)}
          </span>
        </div>
      )}
    </div>
  )
}

// Quick date range presets
export interface QuickDateRangeProps {
  onChange: (range: DateRange) => void
  className?: string
}

export function QuickDateRange({ onChange, className = '' }: QuickDateRangeProps) {
  const presets = [
    {
      label: 'Today',
      getValue: () => {
        const today = new Date().toISOString().split('T')[0]
        return { startDate: today, endDate: today }
      }
    },
    {
      label: 'Yesterday',
      getValue: () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dateStr = yesterday.toISOString().split('T')[0]
        return { startDate: dateStr, endDate: dateStr }
      }
    },
    {
      label: 'Last 7 days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        }
      }
    },
    {
      label: 'Last 30 days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        }
      }
    },
    {
      label: 'This month',
      getValue: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        }
      }
    }
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          onClick={() => onChange(preset.getValue())}
          className="btn btn-outline btn-xs"
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}