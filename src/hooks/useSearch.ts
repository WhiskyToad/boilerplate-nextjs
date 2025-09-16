'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

export interface SearchOptions {
  debounceMs?: number
  minLength?: number
  searchFields?: string[]
  caseSensitive?: boolean
}

export interface SearchResult<T> {
  item: T
  score?: number
  matches?: string[]
}

export function useSearch<T extends Record<string, any>>(
  items: T[],
  options: SearchOptions = {}
) {
  const {
    debounceMs = 300,
    minLength = 1,
    searchFields = [],
    caseSensitive = false
  } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [searchTerm, debounceMs])

  // Simple text matching function
  const searchInText = useCallback((text: string, term: string): boolean => {
    if (!text || !term) return false
    
    const textToSearch = caseSensitive ? text : text.toLowerCase()
    const termToSearch = caseSensitive ? term : term.toLowerCase()
    
    return textToSearch.includes(termToSearch)
  }, [caseSensitive])

  // Search function
  const performSearch = useCallback((term: string): SearchResult<T>[] => {
    if (!term || term.length < minLength) {
      return items.map(item => ({ item }))
    }

    const results: SearchResult<T>[] = []

    items.forEach(item => {
      const matches: string[] = []
      let hasMatch = false

      // If specific search fields are defined, only search those
      if (searchFields.length > 0) {
        searchFields.forEach(field => {
          const value = item[field]
          if (value && searchInText(String(value), term)) {
            matches.push(field)
            hasMatch = true
          }
        })
      } else {
        // Search all string fields
        Object.entries(item).forEach(([key, value]) => {
          if (typeof value === 'string' && searchInText(value, term)) {
            matches.push(key)
            hasMatch = true
          }
        })
      }

      if (hasMatch) {
        results.push({
          item,
          matches,
          score: matches.length // Simple scoring based on number of field matches
        })
      }
    })

    // Sort by relevance (score)
    return results.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [items, minLength, searchFields, searchInText])

  // Filtered results
  const results = useMemo(() => {
    return performSearch(debouncedSearchTerm)
  }, [performSearch, debouncedSearchTerm])

  // Just the items (without search metadata)
  const filteredItems = useMemo(() => {
    return results.map(result => result.item)
  }, [results])

  const isSearching = searchTerm !== debouncedSearchTerm
  const hasResults = results.length > 0
  const hasSearchTerm = debouncedSearchTerm.length >= minLength

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    results,
    filteredItems,
    isSearching,
    hasResults,
    hasSearchTerm,
    clearSearch
  }
}

// Hook for async search (e.g., API calls)
export function useAsyncSearch<T>(
  searchFunction: (term: string) => Promise<T[]>,
  options: SearchOptions = {}
) {
  const { debounceMs = 300, minLength = 1 } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [searchTerm, debounceMs])

  // Perform search when debounced term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < minLength) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const searchResults = await searchFunction(debouncedSearchTerm)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm, minLength, searchFunction])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setResults([])
    setError(null)
  }, [])

  const hasSearchTerm = debouncedSearchTerm.length >= minLength
  const hasResults = results.length > 0

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    results,
    isLoading,
    error,
    hasResults,
    hasSearchTerm,
    clearSearch
  }
}