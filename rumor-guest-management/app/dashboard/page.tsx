"use client";
import { useState, useEffect } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import GuestList from '@/components/guest-list/GuestList';
import FilterPanel from '@/components/filter-panel/FilterPanel';
import ChatSidebar from '@/components/chat/chat';
import InviteModal from '@/components/invite/InviteModal';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Dashboard() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const activeChatGuestId = useGuestStore(state => state.activeChatGuestId);
  const darkMode = useGuestStore(state => state.darkMode);
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background-subtle border-b border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-text-primary">Guest Management</h1>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-text-inverted bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Guest
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <FilterPanel />
          </div>
          <div className="w-full lg:w-3/4">
            <GuestList />
          </div>
          {activeChatGuestId && (
            <ChatSidebar />
          )}
        </div>
      </main>
      {isInviteModalOpen && (
        <InviteModal onClose={() => setIsInviteModalOpen(false)} />
      )}
    </div>
  );
}