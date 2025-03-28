"use client";

import { useEffect } from 'react';
import { Guest } from '@/models/guest';

interface SuccessStepProps {
  guest: Partial<Guest>;
  onClose: () => void;
}

export default function SuccessStep({ guest, onClose }: SuccessStepProps) {
  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="text-center py-4">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
        <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Invitation Sent!</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {guest.fullName} has been successfully invited to your event.
      </p>
      <div className="mt-5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return to Guest List
        </button>
      </div>
    </div>
  );
}