
"use client";

import { useState } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import Drawer from '@/components/ui/Drawer';
import SearchStep from '@/components/invite/steps/SearchStep';
import DetailsStep from '@/components/invite/steps/DetailsStep';
import ConfirmStep from '@/components/invite/steps/ConfirmStep';
import SuccessStep from '@/components/invite/steps/SuccessStep';

interface InviteModalProps {
  onClose: () => void;
}

export type NewGuest = {
  fullName: string;
  email: string;
  phone?: string;
  instagramHandle: string;
  followerCount: number;
  notes?: string;
  tags: string[];
};

export default function InviteModal({ onClose }: InviteModalProps) {
  const [step, setStep] = useState(1);
  const [newGuest, setNewGuest] = useState<Partial<NewGuest>>({
    tags: [],
  });
  const { addGuest, fetchGuests } = useGuestStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSearchComplete = (guestData: Partial<NewGuest>) => {
    setNewGuest(guestData);
    setStep(2);
  };
  
  const handleDetailsComplete = (guestData: Partial<NewGuest>) => {
    setNewGuest({ ...newGuest, ...guestData });
    setStep(3);
  };
  
  const handleConfirm = async () => {
    if (newGuest.fullName && newGuest.email) {
      try {
        setIsSubmitting(true);
        
        await addGuest({
          fullName: newGuest.fullName,
          email: newGuest.email,
          instagramHandle: newGuest.instagramHandle || '',
          followerCount: newGuest.followerCount || 0,
          rsvpStatus: 'invited',
          tags: newGuest.tags || [],
          invitedBefore: false,
          phone: newGuest.phone,
          notes: newGuest.notes,
        });
        
        // Refresh guest list immediately
        await fetchGuests();
        
        // Show success step (which will auto-close)
        setStep(4);
      } catch (error) {
        console.error('Failed to add guest:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleClose = () => {
    if (step === 4) {
      // If on success screen, ensure the guest list is refreshed
      fetchGuests();
    }
    onClose();
  };
  
  // Get the title and description based on current step
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Invite New Guest';
      case 2: return 'Guest Details';
      case 3: return 'Confirm Invitation';
      case 4: return 'Invitation Sent';
    }
  };
  
  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Search for an existing user or add a new guest.';
      case 2: return 'Provide details about the guest.';
      case 3: return 'Review and confirm the invitation.';
      case 4: return 'The invitation has been sent successfully.';
    }
  };
  
  return (
    <Drawer
      isOpen={true}
      onClose={handleClose}
      title={getStepTitle()}
      description={getStepDescription()}
    >
      <div className="py-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${(step / 4) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className={step >= 1 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>Search</span>
              <span className={step >= 2 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>Details</span>
              <span className={step >= 3 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>Confirm</span>
              <span className={step >= 4 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}>Complete</span>
            </div>
          </div>
        </div>
        
        {/* Step content */}
        {step === 1 && <SearchStep onContinue={handleSearchComplete} />}
        {step === 2 && <DetailsStep guest={newGuest} onContinue={handleDetailsComplete} onBack={() => setStep(1)} />}
        {step === 3 && (
          <ConfirmStep 
            guest={newGuest} 
            onConfirm={handleConfirm} 
            onBack={() => setStep(2)} 
            isSubmitting={isSubmitting}
          />
        )}
        {step === 4 && <SuccessStep guest={newGuest} onClose={handleClose} />}
      </div>
    </Drawer>
  );
}