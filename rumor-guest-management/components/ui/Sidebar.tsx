"use client";
import { useState, useEffect, ReactNode } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  children: ReactNode;
}

export default function Sidebar({
  isOpen,
  onClose,
  position = 'right',
  width = 'md',
  title,
  headerContent,
  footerContent,
  children
}: SidebarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Determine width class based on size prop
  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[width];
  
  // Determine transform based on position
  const transform = position === 'right'
    ? isAnimating ? 'translate-x-0' : 'translate-x-full'
    : isAnimating ? 'translate-x-0' : '-translate-x-full';
  
  // Determine position class
  const positionClass = position === 'right' ? 'right-0' : 'left-0';
  const paddingClass = position === 'right' ? 'pl-10' : 'pr-10';

  return (
    <div className="fixed inset-0 z-30 overflow-hidden">
      {/* Background overlay with blur */}
      <div
        className={`fixed inset-0 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'bg-black/30' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      {/* Sidebar panel */}
      <div className={`fixed inset-y-0 ${positionClass} flex max-w-full ${paddingClass} pointer-events-none`}>
        <div
          className={`pointer-events-auto w-screen ${widthClass} transform transition ease-in-out duration-300 ${transform}`}
        >
          <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
            {/* Header */}
            {(title || headerContent) && (
              <div className="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {title && <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>}
                    {headerContent}
                  </div>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="relative flex-1 px-4 sm:px-6 overflow-auto">
              {children}
            </div>
            
            {/* Footer */}
            {footerContent && (
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
                {footerContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}