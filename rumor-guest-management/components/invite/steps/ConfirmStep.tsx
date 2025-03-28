
"use client";

import { useGuestStore } from '@/store/useGuestStore';
import { Guest } from '@/models/guest';

interface ConfirmStepProps {
  guest: Partial<Guest>;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ConfirmStep({ guest, onConfirm, onBack, isSubmitting }: ConfirmStepProps) {
  const { tags } = useGuestStore();
  
  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#767676';
  };
  
  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Guest Information</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
            <span className="text-sm text-gray-900 dark:text-white font-medium">{guest.fullName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
            <span className="text-sm text-gray-900 dark:text-white font-medium">{guest.email}</span>
          </div>
          
          {guest.phone && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">{guest.phone}</span>
            </div>
          )}
          
          {guest.instagramHandle && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Instagram:</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">{guest.instagramHandle}</span>
            </div>
          )}
          
          {guest.followerCount !== undefined && guest.followerCount > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Followers:</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">{guest.followerCount.toLocaleString()}</span>
            </div>
          )}
          
          {guest.tags && guest.tags.length > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Tags:</span>
              <div className="flex flex-wrap justify-end gap-1">
                {guest.tags.map((tagName, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getTagColor(tagName)}20`,
                      color: getTagColor(tagName)
                    }}
                  >
                    {tagName}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {guest.notes && (
            <div className="pt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Notes:</span>
              <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-2 rounded">{guest.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Invitation Details</h4>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            An invitation email will be sent to {guest.email}. The guest will receive a unique link to RSVP to your event.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Invitation'
          )}
        </button>
      </div>
    </div>
  );
}