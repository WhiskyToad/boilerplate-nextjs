'use client'

import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tableVariants = cva(
  'table w-full',
  {
    variants: {
      variant: {
        default: '',
        zebra: 'table-zebra',
        compact: 'table-compact',
      },
      size: {
        sm: 'table-sm',
        md: '',
        lg: 'table-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const tableContainerVariants = cva(
  'bg-base-100 rounded-lg border border-base-300',
  {
    variants: {
      variant: {
        default: '',
        elevated: 'shadow-lg',
        outlined: 'border-2 border-base-300',
      },
      overflow: {
        auto: 'overflow-x-auto',
        hidden: 'overflow-hidden',
        visible: 'overflow-visible',
      },
    },
    defaultVariants: {
      variant: 'default',
      overflow: 'auto',
    },
  }
)

// Table Container Component
export interface TableContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableContainerVariants> {}

const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, variant, overflow, children, ...props }, ref) => {
    return (
      <div
        className={cn(tableContainerVariants({ variant, overflow }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TableContainer.displayName = 'TableContainer'

// Table Component
export interface TableProps
  extends HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <table
        className={cn(tableVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </table>
    )
  }
)
Table.displayName = 'Table'

// Table Header Component
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead className={cn('', className)} ref={ref} {...props}>
        {children}
      </thead>
    )
  }
)
TableHeader.displayName = 'TableHeader'

// Table Body Component
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody className={cn('', className)} ref={ref} {...props}>
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = 'TableBody'

// Table Row Component
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hover?: boolean
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <tr
        className={cn(hover && 'hover', className)}
        ref={ref}
        {...props}
      >
        {children}
      </tr>
    )
  }
)
TableRow.displayName = 'TableRow'

// Table Header Cell Component
export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | null
  onSort?: () => void
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable = false, sorted = null, onSort, children, ...props }, ref) => {
    return (
      <th
        className={cn(
          sortable && 'cursor-pointer select-none hover:bg-base-200',
          className
        )}
        ref={ref}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && (
            <span className="text-xs text-base-content/40">
              {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
            </span>
          )}
        </div>
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'

// Table Cell Component  
export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  colSpan?: number
  rowSpan?: number
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td className={cn('', className)} ref={ref} {...props}>
        {children}
      </td>
    )
  }
)
TableCell.displayName = 'TableCell'

// Table Footer Component
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tfoot className={cn('', className)} ref={ref} {...props}>
        {children}
      </tfoot>
    )
  }
)
TableFooter.displayName = 'TableFooter'

// Empty State Component
export interface TableEmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

const TableEmptyState = ({
  icon,
  title,
  description,
  action,
}: TableEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-base-content/60 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-base-content/40 mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

export {
  Table,
  TableContainer,
  TableHeader,
  TableBody,  
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  TableEmptyState,
  tableVariants,
  tableContainerVariants,
}