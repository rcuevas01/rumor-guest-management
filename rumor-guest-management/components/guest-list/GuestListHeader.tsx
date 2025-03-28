
"use client";

import { useGuestStore } from '@/store/useGuestStore';

interface GuestListHeaderProps {
  onSelectAll: () => void;
  allSelected: boolean;
}

export function GuestListHeader({ onSelectAll, allSelected }: GuestListHeaderProps) {
  const { sortField, sortDirection, setSorting } = useGuestStore();

  // Helper function to render sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) {
      return null;
    }

    return (
      <span className="ml-1 text-primary">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <thead className="bg-background-muted">
      <tr>
        <th scope="col" className="px-6 py-3 text-left">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
            checked={allSelected}
            onChange={onSelectAll}
          />
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
          onClick={() => setSorting('fullName')}
        >
          <div className="flex items-center">
            Name {getSortIndicator('fullName')}
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
          onClick={() => setSorting('rsvpStatus')}
        >
          <div className="flex items-center">
            Status {getSortIndicator('rsvpStatus')}
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
          onClick={() => setSorting('instagramHandle')}
        >
          <div className="flex items-center">
            Instagram {getSortIndicator('instagramHandle')}
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
          onClick={() => setSorting('followerCount')}
        >
          <div className="flex items-center">
            Followers {getSortIndicator('followerCount')}
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
        >
          Tags
        </th>
        <th scope="col" className="relative px-6 py-3">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}