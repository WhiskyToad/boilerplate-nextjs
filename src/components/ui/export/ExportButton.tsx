'use client'

import { useState } from 'react'
import { FiDownload, FiFileText, FiGrid } from 'react-icons/fi'
import { Button } from '@/components/ui/button/Button'
import { csvExporter, ExportColumn } from '@/lib/export/csv-export'
import { pdfExporter, PDFTableColumn } from '@/lib/export/pdf-export'

export interface ExportButtonProps<T> {
  data: T[]
  columns: ExportColumn<T>[]
  pdfColumns?: PDFTableColumn<T>[]
  filename?: string
  title?: string
  subtitle?: string
  variant?: 'dropdown' | 'single' | 'buttons'
  format?: 'csv' | 'pdf' | 'both'
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function ExportButton<T extends Record<string, any>>({
  data,
  columns,
  pdfColumns,
  filename,
  title = 'Data Export',
  subtitle,
  variant = 'dropdown',
  format = 'both',
  disabled = false,
  className = '',
  size = 'md',
  loading = false
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false)

  const handleCSVExport = async () => {
    if (isExporting || disabled) return
    
    setIsExporting(true)
    try {
      const exportFilename = filename || `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
      csvExporter.exportAndDownload(data, columns, { filename: exportFilename })
    } catch (error) {
      console.error('CSV export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePDFExport = async () => {
    if (isExporting || disabled) return
    
    setIsExporting(true)
    try {
      const columnsToUse = pdfColumns || columns.map(col => ({
        key: col.key,
        label: col.label,
        format: col.format
      }))
      
      pdfExporter.exportToPDF(data, columnsToUse, {
        title,
        subtitle,
        filename,
        includeDate: true
      })
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const isDisabled = disabled || loading || isExporting || data.length === 0

  if (variant === 'single') {
    const isCsvOnly = format === 'csv'
    return (
      <Button
        onClick={isCsvOnly ? handleCSVExport : handlePDFExport}
        disabled={isDisabled}
        size={size}
        className={`gap-2 ${className}`}
        loading={isExporting}
      >
        <FiDownload className="w-4 h-4" />
        Export {isCsvOnly ? 'CSV' : 'PDF'}
      </Button>
    )
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {(format === 'csv' || format === 'both') && (
          <Button
            onClick={handleCSVExport}
            disabled={isDisabled}
            size={size}
            variant="outline"
            className="gap-2"
            loading={isExporting}
          >
            <FiGrid className="w-4 h-4" />
            CSV
          </Button>
        )}
        {(format === 'pdf' || format === 'both') && (
          <Button
            onClick={handlePDFExport}
            disabled={isDisabled}
            size={size}
            variant="outline"
            className="gap-2"
            loading={isExporting}
          >
            <FiFileText className="w-4 h-4" />
            PDF
          </Button>
        )}
      </div>
    )
  }

  // Dropdown variant (default)
  return (
    <div className={`dropdown dropdown-bottom dropdown-end ${className}`}>
      <div tabIndex={0} role="button" className={`btn gap-2 ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''} ${isDisabled ? 'btn-disabled' : ''}`}>
        <FiDownload className="w-4 h-4" />
        Export
        {isExporting && <span className="loading loading-spinner loading-xs"></span>}
      </div>
      
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300 z-10">
        {(format === 'csv' || format === 'both') && (
          <li>
            <button
              onClick={handleCSVExport}
              disabled={isDisabled}
              className="flex items-center gap-2"
            >
              <FiGrid className="w-4 h-4" />
              Export CSV
            </button>
          </li>
        )}
        {(format === 'pdf' || format === 'both') && (
          <li>
            <button
              onClick={handlePDFExport}
              disabled={isDisabled}
              className="flex items-center gap-2"
            >
              <FiFileText className="w-4 h-4" />
              Export PDF
            </button>
          </li>
        )}
        {data.length === 0 && (
          <li>
            <span className="text-base-content/50 text-sm">No data to export</span>
          </li>
        )}
      </ul>
    </div>
  )
}

// Quick export hooks for common use cases
export function useCSVExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportCSV = async <T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn<T>[],
    filename?: string
  ) => {
    setIsExporting(true)
    try {
      csvExporter.exportAndDownload(data, columns, { filename })
    } catch (error) {
      console.error('CSV export failed:', error)
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  return { exportCSV, isExporting }
}

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportPDF = async <T extends Record<string, any>>(
    data: T[],
    columns: PDFTableColumn<T>[],
    options?: {
      title?: string
      subtitle?: string
      filename?: string
    }
  ) => {
    setIsExporting(true)
    try {
      pdfExporter.exportToPDF(data, columns, options)
    } catch (error) {
      console.error('PDF export failed:', error)
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  return { exportPDF, isExporting }
}