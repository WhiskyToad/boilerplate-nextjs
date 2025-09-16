'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface FilterConfig {
  [key: string]: string | number | boolean | string[]
}

export interface UseFiltersOptions {
  defaultFilters?: FilterConfig
  persistInUrl?: boolean
  debounceMs?: number
}

export function useFilters<T extends FilterConfig = FilterConfig>(
  options: UseFiltersOptions = {}
) {
  const {
    defaultFilters = {},
    persistInUrl = false,
    debounceMs = 300
  } = options

  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filters from URL params or defaults
  const getInitialFilters = useCallback((): T => {
    if (persistInUrl && searchParams) {
      const urlFilters: FilterConfig = {}
      searchParams.forEach((value, key) => {
        // Handle arrays (comma-separated values)
        if (value.includes(',')) {
          urlFilters[key] = value.split(',')
        } else {
          // Try to parse as number or boolean
          if (value === 'true') urlFilters[key] = true
          else if (value === 'false') urlFilters[key] = false
          else if (!isNaN(Number(value))) urlFilters[key] = Number(value)
          else urlFilters[key] = value
        }
      })
      return { ...defaultFilters, ...urlFilters } as T
    }
    return defaultFilters as T
  }, [defaultFilters, persistInUrl, searchParams])

  const [filters, setFilters] = useState<T>(getInitialFilters)

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: T) => {
    if (!persistInUrl) return

    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else {
          params.set(key, String(value))
        }
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    
    router.replace(newUrl, { scroll: false })
  }, [persistInUrl, router])

  // Set a single filter
  const setFilter = useCallback((key: keyof T, value: T[keyof T]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateUrl(newFilters)
  }, [filters, updateUrl])

  // Set multiple filters at once
  const setMultipleFilters = useCallback((newFilters: Partial<T>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    updateUrl(updatedFilters)
  }, [filters, updateUrl])

  // Clear a single filter
  const clearFilter = useCallback((key: keyof T) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    updateUrl(newFilters)
  }, [filters, updateUrl])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({} as T)
    updateUrl({} as T)
  }, [updateUrl])

  // Reset to default filters
  const resetFilters = useCallback(() => {
    const resetFilters = defaultFilters as T
    setFilters(resetFilters)
    updateUrl(resetFilters)
  }, [defaultFilters, updateUrl])

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key]
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== null && value !== ''
    }).length
  }, [filters])

  // Get filter summaries for display
  const filterSummaries = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0
        return value !== undefined && value !== null && value !== ''
      })
      .map(([key, value]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: Array.isArray(value) ? value.join(', ') : String(value),
        onRemove: () => clearFilter(key as keyof T)
      }))
  }, [filters, clearFilter])

  // Check if a filter has a value
  const hasFilter = useCallback((key: keyof T) => {
    const value = filters[key]
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  }, [filters])

  // Get filter value with fallback
  const getFilter = useCallback(<K extends keyof T>(
    key: K,
    fallback?: T[K]
  ): T[K] => {
    return filters[key] ?? fallback
  }, [filters])

  return {
    filters,
    setFilter,
    setMultipleFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    hasFilter,
    getFilter,
    activeFiltersCount,
    filterSummaries
  }
}