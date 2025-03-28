
"use client";

import React, { useState, useRef, useEffect } from 'react';

interface GuestListActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onTagSelected: () => void;
}

export function GuestListActions({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  onTagSelected,
}: GuestListActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="bg-primary-muted border-b border-primary-muted rounded-t-lg">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-primary-strong">
              {selectedCount} selected
            </span>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-sm text-primary hover:text-primary-hover focus:outline-none ml-4"
            >
              Clear selection
            </button>
          </div>
          
          <div className="flex items-center space-x-8">
            <button
              type="button"
              onClick={onDeleteSelected}
              className="inline-flex items-center px-3 py-1.5 border border-error-600 text-xs font-medium rounded-md text-error-600 hover:bg-error-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 mr-4"
            >
              Delete Selected
            </button>
            
            <button
              type="button"
              onClick={onTagSelected}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-text-inverted bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ml-4"
            >
              Add Tags
            </button>
            
            
           
          </div>
        </div>
      </div>
    </div>
  );
}