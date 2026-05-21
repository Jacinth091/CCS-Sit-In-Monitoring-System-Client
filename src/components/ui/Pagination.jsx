import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildPageWindow } from '../../utils/paginationUtils';

const Pagination = ({ currentPage, totalPages, onPageChange, maxVisible = 10 }) => {
  // Always show pagination even if only 1 page exists
  const pages = buildPageWindow(currentPage, totalPages, maxVisible);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center justify-center h-8 w-8 rounded-[6px] border border-border bg-white text-primary hover:bg-bg-secondary hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
      </button>

      {pages.map((page, index) => {
        const isEllipsis = page === '...';
        const isActive = page === currentPage;

        if (isEllipsis) {
          return (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center h-8 w-8 text-primary-light text-xs font-semibold">
              …
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => page !== currentPage && onPageChange(page)}
            className={`flex items-center justify-center h-8 w-8 rounded-[6px] text-xs font-semibold transition-all duration-150 ${
              isActive
                ? 'bg-primary text-white shadow-none'
                : 'bg-white border border-border text-primary hover:bg-bg-secondary hover:shadow-sm'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center justify-center h-8 w-8 rounded-[6px] border border-border bg-white text-primary hover:bg-bg-secondary hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        <ChevronRight className="w-4 h-4 text-primary" />
      </button>
    </nav>
  );
};

export default Pagination;
