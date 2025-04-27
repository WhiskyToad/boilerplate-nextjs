import React, { useState, useMemo } from "react";
import { FiChevronUp, FiChevronDown, FiFilter } from "react-icons/fi";
import Pagination from "../Navigation/Pagination";

export interface TableColumn<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => any);
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  sortable?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyField,
  pagination = true,
  pageSize = 10,
  onRowClick,
  className = "",
  striped = true,
  hover = true,
  bordered = false,
  compact = false,
  loading = false,
  loadingText = "Loading...",
  emptyText = "No data available",
  sortable = true,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | ((row: T) => any) | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Sort data if needed
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue =
        typeof sortConfig.key === "function"
          ? sortConfig.key(a)
          : a[sortConfig.key as keyof T];
      const bValue =
        typeof sortConfig.key === "function"
          ? sortConfig.key(b)
          : b[sortConfig.key as keyof T];

      if (aValue === bValue) return 0;

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortConfig]);

  // Handle pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(data.length / pageSize);
  }, [data, pageSize, pagination]);

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable) return;

    const accessor = column.accessor;

    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === accessor) {
        return {
          key: accessor,
          direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: accessor, direction: "asc" };
    });
  };

  // Get value from row based on accessor
  const getValue = (row: T, accessor: keyof T | ((row: T) => any)) => {
    if (typeof accessor === "function") {
      return accessor(row);
    }
    return row[accessor];
  };

  // Get sort indicator
  const getSortIndicator = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable) return null;

    if (sortConfig.key !== column.accessor) {
      return <FiFilter className="ml-1 w-4 h-4 opacity-30" />;
    }

    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="ml-1 w-4 h-4 text-primary" />
    ) : (
      <FiChevronDown className="ml-1 w-4 h-4 text-primary" />
    );
  };

  // Apply table style variants
  const tableClasses = [
    "table w-full",
    striped ? "table-zebra" : "",
    hover ? "table-hover" : "",
    bordered ? "table-bordered" : "",
    compact ? "table-xs" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${
                  column.sortable && sortable
                    ? "cursor-pointer select-none"
                    : ""
                } ${column.width ? column.width : ""} ${
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                    ? "text-right"
                    : "text-left"
                }`}
                onClick={() => handleSort(column)}
                style={{ width: column.width }}
              >
                <div className="flex items-center">
                  <span>{column.header}</span>
                  {getSortIndicator(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <div className="loader animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-3"></div>
                  {loadingText}
                </div>
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                {emptyText}
              </td>
            </tr>
          ) : (
            paginatedData.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {columns.map((column, cellIndex) => {
                  const value = getValue(row, column.accessor);
                  return (
                    <td
                      key={cellIndex}
                      className={
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : ""
                      }
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && !loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default Table;
