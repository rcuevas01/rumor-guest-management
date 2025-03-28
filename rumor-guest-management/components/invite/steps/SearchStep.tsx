
"use client";

import { useState } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import { NewGuest } from '@/components/invite/InviteModal';
import { Guest } from '@/models/guest';

interface SearchStepProps {
  onContinue: (guestData: Partial<NewGuest>) => void;
}

export default function SearchStep({ onContinue }: SearchStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      params.append('search', searchTerm);
      params.append('limit', '5'); // Limit to top 5 results for the search
      
      const response = await fetch(`/api/guests?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search guests');
      }
      
      const data = await response.json();
      setSearchResults(data.guests || []);
    } catch (error) {
      console.error('Error searching guests:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectExisting = (guest: Guest) => {
    onContinue({
      fullName: guest.fullName,
      email: guest.email,
      instagramHandle: guest.instagramHandle,
      followerCount: guest.followerCount,
      tags: guest.tags || [],
    });
  };
  
  const handleCreateNew = () => {
    // Pre-fill with search term if it looks like an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchTerm);
    
    onContinue({
      fullName: '',
      email: isEmail ? searchTerm : '',
      instagramHandle: searchTerm.startsWith('@') ? searchTerm : '',
      followerCount: 0,
      tags: [],
    });
  };
  
  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border-border rounded-l-md shadow-sm focus:border-primary focus:ring-primary dark:bg-background-subtle py-1 px-2"
            placeholder="Search by name, email, or Instagram"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-text-inverted bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : 'Search'}
          </button>
        </div>
      </form>
      
      {isSearching ? (
        <div className="flex justify-center py-4">
          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Existing Guests</h4>
          <div className="space-y-2 mb-6">
            {searchResults.map((guest) => (
              <div 
                key={guest.id}
                className="p-3 border border-border rounded-md hover:bg-background-subtle cursor-pointer"
                onClick={() => handleSelectExisting(guest)}
              >
                <div className="font-medium text-text-primary">{guest.fullName}</div>
                <div className="text-sm text-text-secondary">{guest.email}</div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-text-secondary">{guest.instagramHandle}</span>
                  {guest.followerCount > 0 && (
                    <>
                      <span className="mx-1 text-text-secondary">•</span>
                      <span className="text-sm text-text-secondary">{guest.followerCount.toLocaleString()} followers</span>
                    </>
                  )}
                </div>
                {guest.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {guest.tags.map(tag => (
                      <span 
                        key={`${guest.id}-${tag}`} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background-muted text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : searchTerm.trim() !== '' && (
        <div className="text-center py-4 mb-4">
          <p className="text-text-secondary mb-2">No existing guests found</p>
        </div>
      )}
      
      <div className="border-t border-border pt-4 pb-2">
        <button
          type="button"
          onClick={handleCreateNew}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-text-inverted bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Create New Guest
        </button>
      </div>
    </div>
  );
}