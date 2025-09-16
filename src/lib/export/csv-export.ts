export interface ExportColumn<T = any> {
  key: keyof T | string
  label: string
  format?: (value: any, row: T) => string
}

export interface ExportOptions {
  filename?: string
  includeHeaders?: boolean
  delimiter?: string
  dateFormat?: string
}

class CSVExporter {
  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) return ''
    
    const stringValue = String(value)
    
    // If the value contains comma, quotes, or newlines, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    
    return stringValue
  }

  private formatValue<T>(value: any, row: T, format?: (value: any, row: T) => string): string {
    if (format) {
      return format(value, row)
    }
    
    // Default formatting
    if (value instanceof Date) {
      return value.toISOString().split('T')[0] // YYYY-MM-DD format
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    
    if (Array.isArray(value)) {
      return value.join('; ')
    }
    
    return value
  }

  exportToCSV<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn<T>[],
    options: ExportOptions = {}
  ): string {
    const {
      includeHeaders = true,
      delimiter = ','
    } = options

    const rows: string[] = []

    // Add headers
    if (includeHeaders) {
      const headers = columns.map(col => this.escapeCSVValue(col.label))
      rows.push(headers.join(delimiter))
    }

    // Add data rows
    data.forEach(row => {
      const values = columns.map(col => {
        const value = typeof col.key === 'string' && col.key.includes('.') 
          ? this.getNestedValue(row, col.key)
          : row[col.key as keyof T]
        
        const formattedValue = this.formatValue(value, row, col.format)
        return this.escapeCSVValue(formattedValue)
      })
      rows.push(values.join(delimiter))
    })

    return rows.join('\n')
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  downloadCSV(csvContent: string, filename: string = 'export.csv'): void {
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  exportAndDownload<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn<T>[],
    options: ExportOptions = {}
  ): void {
    const csvContent = this.exportToCSV(data, columns, options)
    const filename = options.filename || `export-${new Date().toISOString().split('T')[0]}.csv`
    this.downloadCSV(csvContent, filename)
  }
}

export const csvExporter = new CSVExporter()

// Utility function for common date formatting
export const formatDate = (date: Date | string | null | undefined, format: 'date' | 'datetime' | 'time' = 'date'): string => {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'datetime':
      return d.toLocaleString()
    case 'time':
      return d.toLocaleTimeString()
    case 'date':
    default:
      return d.toLocaleDateString()
  }
}

// Common column definitions for typical data
export const commonColumns = {
  id: { key: 'id', label: 'ID' },
  email: { key: 'email', label: 'Email' },
  name: { key: 'name', label: 'Name' },
  createdAt: { 
    key: 'created_at', 
    label: 'Created Date',
    format: (value: any) => formatDate(value, 'date')
  },
  updatedAt: { 
    key: 'updated_at', 
    label: 'Updated Date',
    format: (value: any) => formatDate(value, 'date')
  },
  status: { key: 'status', label: 'Status' }
} as const