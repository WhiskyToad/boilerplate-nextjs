'use client'

import { useState, useCallback, useEffect } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { Input } from '@/components/ui/input/Input'

export interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  debounceMs?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  autoFocus?: boolean
}

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  debounceMs = 300,
  className = '',
  size = 'md',
  disabled = false,
  autoFocus = false
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')
  const [debouncedValue, setDebouncedValue] = useState(controlledValue || '')

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  // Debounce the search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [value, debounceMs])

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch && debouncedValue !== (controlledValue || '')) {
      onSearch(debouncedValue)
    }
  }, [debouncedValue, onSearch, controlledValue])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }
    
    onChange?.(newValue)
  }, [isControlled, onChange])

  const handleClear = useCallback(() => {
    const newValue = ''
    
    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }
    
    onClear?.()
    onSearch?.(newValue)
  }, [isControlled, onChange, onClear, onSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch?.(value)
    }
    if (e.key === 'Escape') {
      handleClear()
    }
  }, [value, onSearch, handleClear])

  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md', 
    lg: 'input-lg'
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4 pointer-events-none" />
        
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`pl-10 pr-10 ${sizeClasses[size]}`}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear search"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}