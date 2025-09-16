'use client'

import { FiFilter, FiX } from 'react-icons/fi'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterSelectProps {
  label: string
  value?: string
  options: FilterOption[]
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  showCount?: boolean
  multiple?: boolean
}

export function FilterSelect({
  label,
  value = '',
  options,
  onChange,
  onClear,
  placeholder = 'Select...',
  className = '',
  showCount = false,
  multiple = false
}: FilterSelectProps) {
  const hasValue = value && value !== ''

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-medium flex items-center gap-2">
          <FiFilter className="w-4 h-4" />
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
      
      <select
        value={value}
        onChange={handleSelectChange}
        className="select select-bordered w-full"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {showCount && option.count !== undefined && ` (${option.count})`}
          </option>
        ))}
      </select>
    </div>
  )
}

// Multi-select variant
export function FilterMultiSelect({
  label,
  value = '',
  options,
  onChange,
  onClear,
  placeholder = 'Select...',
  className = '',
  showCount = false
}: FilterSelectProps) {
  const selectedValues = value ? value.split(',') : []
  const hasValue = selectedValues.length > 0

  const handleOptionToggle = (optionValue: string) => {
    const newSelected = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue]
    
    onChange(newSelected.join(','))
  }

  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-medium flex items-center gap-2">
          <FiFilter className="w-4 h-4" />
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
      
      <div className="dropdown dropdown-bottom w-full">
        <div tabIndex={0} role="button" className="btn btn-outline w-full justify-start">
          {hasValue ? (
            <span className="truncate">
              {selectedValues.length} selected
            </span>
          ) : (
            <span className="text-base-content/60">{placeholder}</span>
          )}
        </div>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full border border-base-300 z-10">
          {options.map((option) => (
            <li key={option.value}>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleOptionToggle(option.value)}
                  className="checkbox checkbox-sm"
                />
                <span className="flex-1">
                  {option.label}
                  {showCount && option.count !== undefined && (
                    <span className="text-base-content/60"> ({option.count})</span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}