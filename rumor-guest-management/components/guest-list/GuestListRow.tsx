"use client";

import { useState, useRef, useEffect } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import { Guest } from '@/models/guest';

interface GuestListRowProps {
  guest: Guest;
  isSelected: boolean;
}

export function GuestListRow({ guest, isSelected }: GuestListRowProps) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    toggleSelectGuest, 
    setActiveChatGuest, 
    tags, 
    updateGuestTags, 
    createTagAndAddToGuest 
  } = useGuestStore();
  
  // Focus the input when it appears
  useEffect(() => {
    if (showTagInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTagInput]);
  
  const handleRowClick = () => {
    setActiveChatGuest(guest.id);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'attending':
        return 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-500';
      case 'declined':
        return 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-500';
      case 'pending':
        return 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-500';
      case 'invited':
        return 'bg-info-50 text-info-700 dark:bg-info-900/20 dark:text-info-500';
      default:
        return 'bg-background-muted text-text-secondary';
    }
  };
  
  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  // Get the color for a tag
  const getTagColor = (tagName: string) => {
    const foundTag = tags.find(tag => tag.name === tagName);
    return foundTag?.color || '#767676';
  };
  
  const handleRemoveTag = (e: React.MouseEvent, tagName: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    // Ensure we're passing the correct parameters to updateGuestTags
    updateGuestTags([guest.id], [], [tagName]);
  };
  
  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent row click
    
    if (!newTagValue.trim()) {
      setShowTagInput(false);
      return;
    }
    
    // Check if this tag already exists
    const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagValue.trim().toLowerCase());
    
    if (existingTag) {
      // Add existing tag to guest
      updateGuestTags([guest.id], [existingTag.name], []);
    } else {
      // Create new tag and add to guest
      createTagAndAddToGuest(guest.id, newTagValue.trim());
    }
    
    setNewTagValue('');
    setShowTagInput(false);
  };
  
  return (
    <tr 
      className={`hover:bg-background-subtle cursor-pointer ${
        isSelected ? 'bg-primary-muted' : ''
      }`}
      onClick={handleRowClick}
    >
      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => {
        e.stopPropagation();
        toggleSelectGuest(guest.id);
      }}>
        <input
          type="checkbox"
          className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
          checked={isSelected}
          onChange={() => {}}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-text-primary">{guest.fullName}</div>
        <div className="text-sm text-text-secondary">{guest.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(guest.rsvpStatus)}`}>
          {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
        {guest.instagramHandle}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
        {formatFollowerCount(guest.followerCount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap gap-2 items-center">
          {guest.tags.map((tagName) => (
            <div
              key={`${guest.id}-${tagName}`}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium group relative"
              style={{ backgroundColor: `${getTagColor(tagName)}20`, color: getTagColor(tagName) }}
            >
              {tagName}
              <button 
                onClick={(e) => handleRemoveTag(e, tagName)} 
                className="ml-1 text-text-secondary flex items-center justify-center w-4 h-4 rounded-full hover:bg-background-muted"
                aria-label={`Remove ${tagName} tag`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {showTagInput ? (
            <form onSubmit={handleAddNewTag} className="inline-flex">
              <input
                ref={inputRef}
                type="text"
                className="w-24 h-6 text-xs border-border rounded-l shadow-sm focus:border-primary focus:ring-primary"
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                onBlur={() => {
                  if (!newTagValue.trim()) {
                    setShowTagInput(false);
                  }
                }}
                placeholder="New tag..."
              />
              <button
                type="submit"
                className="h-6 px-2 text-xs border border-l-0 border-primary bg-primary text-white rounded-r"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTagInput(true);
              }}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-background-subtle text-text-secondary hover:bg-primary-muted hover:text-primary"
              aria-label="Add tag"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </td>
      
    </tr>
  );
}