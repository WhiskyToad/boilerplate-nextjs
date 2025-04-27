import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "rounded" | "square" | "circle";
  className?: string;
  showFirstLast?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = "md",
  shape = "rounded",
  className = "",
  showFirstLast = false,
}) => {
  // Helper function to generate page ranges
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  // Calculate the pagination items to display
  const getPaginationItems = () => {
    // Always include first and last page
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Calculate the range around the current page
    let startPage = Math.max(firstPageIndex, currentPage - siblingCount);
    let endPage = Math.min(lastPageIndex, currentPage + siblingCount);

    // Add ellipsis logic
    const hasLeftEllipsis = startPage > firstPageIndex + 1;
    const hasRightEllipsis = endPage < lastPageIndex - 1;

    // Always show first page in range
    if (startPage > firstPageIndex) {
      startPage = hasLeftEllipsis ? startPage : firstPageIndex + 1;
    }

    // Always show last page in range
    if (endPage < lastPageIndex) {
      endPage = hasRightEllipsis ? endPage : lastPageIndex - 1;
    }

    // Generate the page range to display
    const itemsToShow = range(startPage, endPage);

    // Add ellipsis and first/last pages if needed
    if (hasLeftEllipsis) {
      itemsToShow.unshift(-1); // -1 as indicator for left ellipsis
      if (startPage > firstPageIndex + 2) {
        itemsToShow.unshift(firstPageIndex);
      }
    } else if (startPage === firstPageIndex + 1) {
      itemsToShow.unshift(firstPageIndex);
    }

    if (hasRightEllipsis) {
      itemsToShow.push(-2); // -2 as indicator for right ellipsis
      if (endPage < lastPageIndex - 1) {
        itemsToShow.push(lastPageIndex);
      }
    } else if (endPage === lastPageIndex - 1) {
      itemsToShow.push(lastPageIndex);
    }

    return itemsToShow;
  };

  // Size classes
  const sizeClass = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  }[size];

  // Shape classes
  const shapeClass = {
    rounded: "",
    square: "rounded-none",
    circle: "rounded-full",
  }[shape];

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const paginationItems = getPaginationItems();

  return (
    <div className={`join ${className}`}>
      {/* Previous button */}
      <button
        className={`join-item btn ${sizeClass} ${shapeClass}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>

      {/* First page button */}
      {showFirstLast && currentPage > 3 && (
        <button
          className={`join-item btn ${sizeClass} ${shapeClass} ${
            currentPage === 1 ? "btn-active" : ""
          }`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      )}

      {/* Page numbers */}
      {paginationItems.map((page, index) => {
        // Render ellipsis
        if (page === -1) {
          return (
            <button
              key={`left-ellipsis`}
              className={`join-item btn ${sizeClass} ${shapeClass} no-animation pointer-events-none`}
              disabled
            >
              &hellip;
            </button>
          );
        }
        if (page === -2) {
          return (
            <button
              key={`right-ellipsis`}
              className={`join-item btn ${sizeClass} ${shapeClass} no-animation pointer-events-none`}
              disabled
            >
              &hellip;
            </button>
          );
        }

        // Render page button
        return (
          <button
            key={page}
            className={`join-item btn ${sizeClass} ${shapeClass} ${
              currentPage === page ? "btn-active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        );
      })}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <button
          className={`join-item btn ${sizeClass} ${shapeClass} ${
            currentPage === totalPages ? "btn-active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      )}

      {/* Next button */}
      <button
        className={`join-item btn ${sizeClass} ${shapeClass}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
