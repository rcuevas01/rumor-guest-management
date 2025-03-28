"use client";

import { useState, useEffect } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import { Guest } from '@/models/guest';

interface DetailsStepProps {
  guest: Partial<Guest>;
  onContinue: (guestData: Partial<Guest>) => void;
  onBack: () => void;
}

export default function DetailsStep({ guest, onContinue, onBack }: DetailsStepProps) {
  const [fullName, setFullName] = useState(guest.fullName || '');
  const [email, setEmail] = useState(guest.email || '');
  const [phone, setPhone] = useState(guest.phone || '');
  const [instagramHandle, setInstagramHandle] = useState(guest.instagramHandle || '');
  const [followerCount, setFollowerCount] = useState(guest.followerCount?.toString() || '');
  const [notes, setNotes] = useState(guest.notes || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(guest.tags || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { tags } = useGuestStore();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (phone && !/^\+?[0-9\s\-\(\)]{7,15}$/.test(phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (followerCount && isNaN(Number(followerCount))) {
      newErrors.followerCount = 'Must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onContinue({
        fullName,
        email,
        phone,
        instagramHandle,
        followerCount: followerCount ? parseInt(followerCount) : 0,
        notes,
        tags: selectedTags,
      });
    }
  };
  
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.fullName ? 'border-red-300' : 'border-gray-300'
            }`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        {/* Instagram */}
        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instagram Handle
          </label>
          <input
            id="instagram"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            placeholder="@username"
          />
        </div>
        
        {/* Follower Count */}
        <div>
          <label htmlFor="followerCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Follower Count
          </label>
          <input
            id="followerCount"
            type="text"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.followerCount ? 'border-red-300' : 'border-gray-300'
            }`}
            value={followerCount}
            onChange={(e) => setFollowerCount(e.target.value)}
          />
          {errors.followerCount && (
            <p className="mt-1 text-sm text-red-600">{errors.followerCount}</p>
          )}
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTags.includes(tag.name)
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
                style={selectedTags.includes(tag.name) ? { backgroundColor: `${tag.color}20`, color: tag.color } : {}}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about the guest..."
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
