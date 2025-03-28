
"use client";
import { useEffect, useState } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import { GuestListHeader } from '@/components/guest-list/GuestListHeader';
import { GuestListRow } from '@/components/guest-list/GuestListRow';
import { GuestListPagination } from '@/components/guest-list/GuestListPagination';
import { GuestListActions } from '@/components/guest-list/GuestListActions';
import { GuestListSkeleton } from '@/components/guest-list/GuestListSkeleton';
import { TagsModal } from '@/components/tags/TagModal';
import Drawer from '@/components/ui/Drawer';
export default function GuestList() {
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    guests,
    isLoading,
    error,
    totalGuests,
    totalPages,
    currentPage,
    selectedGuests,
    fetchGuests,
    setPage,
    selectAllGuests,
    clearSelectedGuests,
    deleteGuests,
    sortField,
    sortDirection
  } = useGuestStore();
  
  useEffect(() => {
    fetchGuests();
  }, [fetchGuests, currentPage, sortField, sortDirection]);
  
  // Handle select all guests on current page
  const handleSelectAllOnPage = () => {
    if (selectedGuests.length === guests.length) {
      clearSelectedGuests();
    } else {
      selectAllGuests(guests.map(guest => guest.id));
    }
  };
  
  // Handle bulk tag action
  const handleTagSelected = () => {
    setIsTagsModalOpen(true);
  };
  
  // Handle bulk delete action
  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };
  
  // Confirm and process delete
  const confirmDelete = async () => {
    try {
      await deleteGuests(selectedGuests);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting guests:', error);
    }
  };
  
  return (
    <div className="bg-background-subtle shadow rounded-lg overflow-hidden">
      {selectedGuests.length > 0 && (
        <GuestListActions
          selectedCount={selectedGuests.length}
          onClearSelection={clearSelectedGuests}
          onDeleteSelected={handleDeleteSelected}
          onTagSelected={handleTagSelected}
        />
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <GuestListHeader
            onSelectAll={handleSelectAllOnPage}
            allSelected={selectedGuests.length === guests.length && guests.length > 0}
          />
          
          {isLoading ? (
            <GuestListSkeleton />
          ) : (
            <tbody className="bg-background divide-y divide-border">
              {error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-error-500">
                    {error}
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-text-muted">
                    No guests found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <GuestListRow
                    key={guest.id}
                    guest={guest}
                    isSelected={selectedGuests.includes(guest.id)}
                  />
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
      
      {!isLoading && (
        <GuestListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalGuests}
          onPageChange={setPage}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
  <Drawer
    isOpen={true}
    onClose={() => setShowDeleteConfirm(false)}
    title="Confirm Delete"
  >
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6">
        <p className="text-text-secondary mb-4">
          Are you sure you want to delete {selectedGuests.length} guest{selectedGuests.length !== 1 ? 's' : ''}? This action cannot be undone.
        </p>
      </div>
      
      <div className="px-6 py-4 border-t border-border flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
          className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-text-secondary bg-background hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirmDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-text-inverted bg-error-500 hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
        >
          Delete
        </button>
      </div>
    </div>
  </Drawer>
)}
      
      {/* Tags Modal */}
      {isTagsModalOpen && (
        <TagsModal
          guestIds={selectedGuests}
          onClose={() => setIsTagsModalOpen(false)}
        />
      )}
    </div>
  );
}