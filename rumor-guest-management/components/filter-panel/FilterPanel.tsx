import { useState, useEffect, useCallback } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import { debounce } from '@/lib/utils';

export default function FilterPanel() {
  const { filters, setFilter, clearFilters, tags, fetchGuests } = useGuestStore();
  
  // Local state for form inputs
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [minFollowers, setMinFollowers] = useState(filters.minFollowers?.toString() || '');
  const [maxFollowers, setMaxFollowers] = useState(filters.maxFollowers?.toString() || '');
  const [tagFilter, setTagFilter] = useState(filters.tag);
  const [invitedBefore, setInvitedBefore] = useState(filters.invitedBefore);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  
  // Create a debounced function for search input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setFilter('search', query || null);
      fetchGuests();
    }, 300),
    [setFilter, fetchGuests]
  );
  
  // Update search filter when search query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);
  
  // Handle regular filters change (non-debounced)
  const handleFilterChange = () => {
    setFilter('status', statusFilter);
    setFilter('minFollowers', minFollowers ? parseInt(minFollowers) : null);
    setFilter('maxFollowers', maxFollowers ? parseInt(maxFollowers) : null);
    setFilter('tag', tagFilter);
    setFilter('invitedBefore', invitedBefore);
    
    // Search is handled separately with debounce
    fetchGuests();
  };
  
  // Handle filter reset
  const handleReset = () => {
    clearFilters();
    setStatusFilter(null);
    setMinFollowers('');
    setMaxFollowers('');
    setTagFilter(null);
    setInvitedBefore(null);
    setSearchQuery('');
    
    // Fetch with reset filters
    fetchGuests();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filter Guests</h2>
      
      <div className="space-y-4">
        {/* Search input (debounced) */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Name, email, or Instagram"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* RSVP Status filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            RSVP Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={statusFilter || ''}
            onChange={(e) => {
              setStatusFilter(e.target.value === '' ? null : e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
          </select>
        </div>
        
        {/* Follower count range */}
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Follower Count
          </span>
          <div className="mt-1 flex space-x-2">
            <div className="flex-1">
              <label htmlFor="minFollowers" className="sr-only">Minimum Followers</label>
              <input
                type="number"
                id="minFollowers"
                placeholder="Min"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
              />
            </div>
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <div className="flex-1">
              <label htmlFor="maxFollowers" className="sr-only">Maximum Followers</label>
              <input
                type="number"
                id="maxFollowers"
                placeholder="Max"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                value={maxFollowers}
                onChange={(e) => setMaxFollowers(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Tag filter */}
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tag
          </label>
          <select
            id="tag"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={tagFilter || ''}
            onChange={(e) => {
              setTagFilter(e.target.value === '' ? null : e.target.value);
            }}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Invited before filter */}
        <div>
          <label htmlFor="invitedBefore" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Invitation History
          </label>
          <select
            id="invitedBefore"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={invitedBefore === null ? '' : invitedBefore ? 'true' : 'false'}
            onChange={(e) => {
              if (e.target.value === '') {
                setInvitedBefore(null);
              } else {
                setInvitedBefore(e.target.value === 'true');
              }
            }}
          >
            <option value="">Any</option>
            <option value="true">Previously Invited</option>
            <option value="false">Never Invited</option>
          </select>
        </div>
        
        {/* Filter buttons */}
        <div className="flex space-x-2 pt-4">
          <button
            type="button"
            onClick={handleFilterChange}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}