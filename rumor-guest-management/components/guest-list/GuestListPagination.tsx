
"use client";

import React from 'react';

interface GuestListPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function GuestListPagination({ currentPage, totalPages, totalItems, onPageChange }: GuestListPaginationProps) {
  // Generate visible page numbers with ellipsis logic
  const getVisiblePages = () => {
    // Always show first and last page
    // For small number of pages, show all
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // For many pages, implement ellipsis logic
    const pages = [];
    
    // Always show current page and a few surrounding
    const rangeStart = Math.max(2, currentPage - 2);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 2);
    
    // Always include page 1
    pages.push(1);
    
    // Add ellipsis if needed
    if (rangeStart > 2) {
      pages.push('ellipsis1');
    }
    
    // Add visible numbered pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis2');
    }
    
    // Always include last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const visiblePages = getVisiblePages();
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-default px-4 py-3 sm:px-6 bg-background">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-secondary">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <nav className="flex items-center space-x-3" aria-label="Pagination">
          {/* Previous button */}
          <button
            onClick={() => showPrevious && onPageChange(currentPage - 1)}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-md border border-border ${
              !showPrevious
                ? 'text-text-muted cursor-not-allowed'
                : 'text-text-primary hover:bg-background-subtle'
            }`}
            disabled={!showPrevious}
          >
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Page numbers in a well-spaced horizontal container */}
          <div className="flex items-center space-x-2">
            {visiblePages.map((page, index) => {
              if (page === 'ellipsis1' || page === 'ellipsis2') {
                return (
                  <span 
                    key={`ellipsis-${index}`} 
                    className="inline-flex items-center justify-center w-10 h-10 text-text-secondary"
                  >
                    …
                  </span>
                );
              }
              
              const isCurrentPage = page === currentPage;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(Number(page))}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium border ${
                    isCurrentPage
                      ? 'bg-primary border-primary text-text-inverted'
                      : 'border-border text-text-primary hover:bg-background-subtle'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => showNext && onPageChange(currentPage + 1)}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-md border border-border ${
              !showNext
                ? 'text-text-muted cursor-not-allowed'
                : 'text-text-primary hover:bg-background-subtle'
            }`}
            disabled={!showNext}
          >
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
      
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => showPrevious && onPageChange(currentPage - 1)}
          className={`relative inline-flex items-center rounded px-4 py-2 text-sm font-medium ${
            !showPrevious
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-primary hover:bg-background-subtle'
          }`}
          disabled={!showPrevious}
        >
          Previous
        </button>
        <span className="text-sm text-text-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => showNext && onPageChange(currentPage + 1)}
          className={`relative inline-flex items-center rounded px-4 py-2 text-sm font-medium ${
            !showNext
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-primary hover:bg-background-subtle'
          }`}
          disabled={!showNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}