'use client'

export interface DropdownOption {
  id: string
  label: string
  subtitle?: string
  value?: any
  isSection?: boolean
  sectionTitle?: string
}

export interface DropdownUIProps {
  options: DropdownOption[]
  selectedOption: DropdownOption | null
  placeholder?: string
  onSelect: (option: DropdownOption) => void
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

export function DropdownUI({
  options,
  selectedOption,
  placeholder = 'Select option',
  onSelect,
  disabled = false,
  isLoading = false,
  className = ''
}: DropdownUIProps) {
  if (isLoading) {
    return <div className={`skeleton h-10 w-full ${className}`}></div>
  }

  return (
    <div className={`dropdown dropdown-bottom w-full ${className}`}>
      <div 
        tabIndex={0} 
        role="button" 
        className={`btn btn-outline w-full justify-start pl-4 ${disabled ? 'btn-disabled' : ''}`}
      >
        <span className="truncate flex-1 text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-xs ml-auto">▼</span>
      </div>
      
      <ul 
        tabIndex={0} 
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow-lg border border-base-300 max-h-80 overflow-y-auto"
      >
        {options.length === 0 ? (
          <li className="text-center py-2">
            <span className="text-base-content/60 text-sm">No options</span>
          </li>
        ) : (
          options.map((option, index) => {
            const isCreateOption = option.id === 'create-new'
            const isSection = option.isSection
            const showSeparator = isCreateOption && options.length > 1
            const prevOption = index > 0 ? options[index - 1] : null
            const showSectionSeparator = option.sectionTitle && prevOption && !prevOption.isSection
            
            if (isSection) {
              return (
                <li key={option.id} className="pointer-events-none">
                  {showSectionSeparator && (
                    <div className="border-t border-base-300 my-2"></div>
                  )}
                  <div className="px-3 py-1 mt-1">
                    <div className="text-xs font-semibold text-base-content/70 uppercase tracking-wide">
                      {option.sectionTitle || option.label}
                    </div>
                  </div>
                </li>
              )
            }
            
            return (
              <li key={option.id}>
                {showSeparator && (
                  <div className="border-t border-base-300 my-1"></div>
                )}
                <a 
                  onClick={() => onSelect(option)}
                  className={`block px-3 py-2 hover:bg-base-200 cursor-pointer rounded-lg ${
                    selectedOption?.id === option.id ? 'bg-primary/10 text-primary' : ''
                  } ${isCreateOption ? 'text-primary font-medium' : ''}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-xs text-base-content/60 truncate mt-0.5">
                        {option.subtitle}
                      </div>
                    )}
                  </div>
                </a>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}