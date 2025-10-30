'use client'

import { useState } from 'react'
import { TimeToggleUI, TimeRange } from './TimeToggleUI'

export interface TimeToggleProps {
  initialRange?: TimeRange
  onChange: (range: TimeRange) => void
  disabled?: boolean
}

export function TimeToggle({
  initialRange = 'week',
  onChange,
  disabled = false
}: TimeToggleProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange)

  const handleChange = (range: TimeRange) => {
    setSelectedRange(range)
    onChange(range)
  }

  return (
    <TimeToggleUI
      selectedRange={selectedRange}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export type { TimeRange }
