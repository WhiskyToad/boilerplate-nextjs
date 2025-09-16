export interface PDFTableColumn<T = any> {
  key: keyof T | string
  label: string
  width?: number
  format?: (value: any, row: T) => string
}

export interface PDFExportOptions {
  title?: string
  subtitle?: string
  filename?: string
  pageOrientation?: 'portrait' | 'landscape'
  pageSize?: 'A4' | 'A3' | 'letter'
  includeDate?: boolean
  includePageNumbers?: boolean
}

// Simple PDF export without external dependencies
// For production, consider using libraries like jsPDF or pdfmake
class PDFExporter {
  private formatValue<T>(value: any, row: T, format?: (value: any, row: T) => string): string {
    if (format) {
      return format(value, row)
    }
    
    if (value === null || value === undefined) return ''
    
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    
    return String(value)
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // Generate HTML table for PDF conversion
  private generateHTMLTable<T extends Record<string, any>>(
    data: T[],
    columns: PDFTableColumn<T>[],
    options: PDFExportOptions = {}
  ): string {
    const { title, subtitle, includeDate = true } = options
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title || 'Export'}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .title { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 0;
            color: #333;
          }
          .subtitle { 
            font-size: 16px; 
            color: #666; 
            margin: 5px 0;
          }
          .export-date { 
            font-size: 10px; 
            color: #999; 
            margin-top: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
            vertical-align: top;
          }
          th { 
            background-color: #f5f5f5; 
            font-weight: bold;
            color: #333;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .no-data {
            text-align: center;
            font-style: italic;
            color: #666;
            padding: 20px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
    `

    // Header
    if (title || subtitle || includeDate) {
      html += '<div class="header">'
      if (title) {
        html += `<h1 class="title">${title}</h1>`
      }
      if (subtitle) {
        html += `<p class="subtitle">${subtitle}</p>`
      }
      if (includeDate) {
        html += `<p class="export-date">Generated on ${new Date().toLocaleString()}</p>`
      }
      html += '</div>'
    }

    // Table
    if (data.length === 0) {
      html += '<div class="no-data">No data available</div>'
    } else {
      html += '<table>'
      
      // Headers
      html += '<thead><tr>'
      columns.forEach(col => {
        const width = col.width ? `style="width: ${col.width}%"` : ''
        html += `<th ${width}>${col.label}</th>`
      })
      html += '</tr></thead>'
      
      // Data rows
      html += '<tbody>'
      data.forEach(row => {
        html += '<tr>'
        columns.forEach(col => {
          const value = typeof col.key === 'string' && col.key.includes('.') 
            ? this.getNestedValue(row, col.key)
            : row[col.key as keyof T]
          
          const formattedValue = this.formatValue(value, row, col.format)
          html += `<td>${formattedValue}</td>`
        })
        html += '</tr>'
      })
      html += '</tbody>'
      
      html += '</table>'
    }

    html += `
        </body>
      </html>
    `

    return html
  }

  // Export to PDF using browser's print functionality
  exportToPDF<T extends Record<string, any>>(
    data: T[],
    columns: PDFTableColumn<T>[],
    options: PDFExportOptions = {}
  ): void {
    const html = this.generateHTMLTable(data, columns, options)
    
    // Open in new window and trigger print
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print()
        // Close window after printing (user can cancel)
        printWindow.onafterprint = () => {
          printWindow.close()
        }
      }
    }
  }

  // Generate downloadable HTML file (can be saved as PDF)
  downloadHTML<T extends Record<string, any>>(
    data: T[],
    columns: PDFTableColumn<T>[],
    options: PDFExportOptions = {}
  ): void {
    const html = this.generateHTMLTable(data, columns, options)
    const filename = options.filename || `export-${new Date().toISOString().split('T')[0]}.html`
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
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
}

export const pdfExporter = new PDFExporter()

// Common PDF column definitions
export const pdfColumns = {
  id: { key: 'id', label: 'ID', width: 10 },
  email: { key: 'email', label: 'Email', width: 25 },
  name: { key: 'name', label: 'Name', width: 20 },
  createdAt: { 
    key: 'created_at', 
    label: 'Created Date',
    width: 15,
    format: (value: any) => value ? new Date(value).toLocaleDateString() : ''
  },
  status: { key: 'status', label: 'Status', width: 15 }
} as const