import { create } from 'zustand';
import { Guest } from '@/models/guest';
import { Tag } from '@/models/tag';

interface GuestStore {
  // Data state
  guests: Guest[];
  isLoading: boolean;
  error: string | null;
  totalGuests: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  

  selectedGuests: string[];
  filters: {
    status: string | null;
    minFollowers: number | null;
    maxFollowers: number | null;
    tag: string | null;
    invitedBefore: boolean | null;
    search: string | null;
  };
  activeChatGuestId: string | null;
  tags: Tag[];
  darkMode: boolean;
  
  selectGuest: (id: string) => void;
  deselectGuest: (id: string) => void;
  toggleSelectGuest: (id: string) => void;
  selectAllGuests: (ids: string[]) => void;
  clearSelectedGuests: () => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  setActiveChatGuest: (id: string | null) => void;
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
  toggleDarkMode: () => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  setSorting: (field: string) => void;
  

  fetchGuests: () => Promise<void>;
  setPage: (page: number) => void;
  addGuest: (guestData: Omit<Guest, 'id'>) => Promise<void>,
  updateGuestTags: (guestIds: string[], tagsToAdd: string[], tagsToRemove?: string[]) => Promise<void>;
  createTagAndAddToGuest: (guestId: string, tagName: string) => Promise<void>;
  deleteGuests: (ids: string[]) => Promise<void>;
}

const initialTags: Tag[] = [
    { id: 'tag-1', name: 'VIP', color: '#FF5A5F' },
    { id: 'tag-2', name: 'Friend', color: '#00A699' },
    { id: 'tag-3', name: 'Family', color: '#FC642D' },
    { id: 'tag-4', name: 'Business', color: '#4D5AE5' },
    { id: 'tag-5', name: 'Press', color: '#767676' },
  ];

// Initialize the store with the additional properties and methods
export const useGuestStore = create<GuestStore>((set, get) => ({
  // Initial state with data-related properties
  guests: [],
  isLoading: false,
  error: null,
  totalGuests: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 50,
  
  selectedGuests: [],
  filters: {
    status: null,
    minFollowers: null,
    maxFollowers: null,
    tag: null,
    invitedBefore: null,
    search: null,
  },
  activeChatGuestId: null,
  tags: initialTags,
  darkMode: false,
  sortField: null,
  sortDirection: 'asc',
  

  selectGuest: (id) => set((state) => ({
    selectedGuests: [...state.selectedGuests, id]
  })),
  deselectGuest: (id) => set((state) => ({
    selectedGuests: state.selectedGuests.filter(guestId => guestId !== id)
  })),
  toggleSelectGuest: (id) => set((state) => {
    if (state.selectedGuests.includes(id)) {
      return { selectedGuests: state.selectedGuests.filter(guestId => guestId !== id) };
    } else {
      return { selectedGuests: [...state.selectedGuests, id] };
    }
  }),
  selectAllGuests: (ids) => set({ selectedGuests: ids }),
  clearSelectedGuests: () => set({ selectedGuests: [] }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    // Reset to page 1 when filters change
    currentPage: 1
  })),
  clearFilters: () => set({
    filters: {
      status: null,
      minFollowers: null,
      maxFollowers: null,
      tag: null,
      invitedBefore: null,
      search: null,
    },
    currentPage: 1
  }),
  setSorting: (field) => set((state) => {
    // If clicking the same field, toggle direction
    if (state.sortField === field) {
      return { 
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
        currentPage: 1 // Reset to first page when changing sort
      };
    }
    // If new field, set to ascending
    return { 
      sortField: field, 
      sortDirection: 'asc',
      currentPage: 1 // Reset to first page when changing sort
    };
  }),
  
  setActiveChatGuest: (id) => set({ activeChatGuestId: id }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (id) => set((state) => ({
    tags: state.tags.filter(tag => tag.id !== id)
  })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  
  
  
  fetchGuests: async () => {
    const state = get();
    try {
      set({ isLoading: true, error: null });
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', state.currentPage.toString());
      params.append('limit', state.limit.toString());
      
      if (state.filters.status) params.append('status', state.filters.status);
      if (state.filters.minFollowers) params.append('minFollowers', state.filters.minFollowers.toString());
      if (state.filters.maxFollowers) params.append('maxFollowers', state.filters.maxFollowers.toString());
      if (state.filters.tag) params.append('tag', state.filters.tag);
      if (state.filters.invitedBefore !== null) params.append('invitedBefore', state.filters.invitedBefore.toString());
      if (state.filters.search) params.append('search', state.filters.search);
      if (state.sortField) {
        params.append('sortField', state.sortField);
        params.append('sortDirection', state.sortDirection);
      }
      
      const response = await fetch(`/api/guests?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch guests');
      }
      
      const data = await response.json();
      
      set({ 
        guests: data.guests,
        totalGuests: data.total,
        totalPages: data.totalPages,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
    }
  },
  
  setPage: (page) => set({ currentPage: page }),

  addGuest: async (guestData: Omit<Guest, 'id'>) => {
    try {
      // Simulate an API call
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add guest');
      }
      
      const newGuest = await response.json();
      
      // Optimistically update the store with the new guest
      set((state) => ({
        guests: [...state.guests, newGuest],
        totalGuests: state.totalGuests + 1,
      }));
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add guest',
      });
      throw error; // Re-throw to allow handling in the component
    }
  },

  
  // Create a new tag and add it to a guest
  createTagAndAddToGuest: async (guestId: string, tagName: string) => {
    try {
      set({ isLoading: true });
      
      // First, create the new tag
      const newTag = {
        id: `tag-${Date.now()}`,
        name: tagName.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
      };
      
      // Add the tag to the store
      set((state) => ({
        tags: [...state.tags, newTag],
      }));
      
      // Then add it to the guest
      await get().updateGuestTags([guestId], [newTag.name], []);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create tag',
        isLoading: false,
      });
    }
  },

  deleteGuests: async (ids: string[]) => {
    try {
      set({ isLoading: true });
      
      // Make API call to delete guests
      const response = await fetch('/api/guests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete guests');
      }
      
      // Optimistically update the store
      set((state) => ({
        guests: state.guests.filter(guest => !ids.includes(guest.id)),
        totalGuests: state.totalGuests - ids.length,
        selectedGuests: [], // Clear selection after delete
        isLoading: false,
      }));
      
      // Refetch to ensure data consistency
      get().fetchGuests();
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete guests',
        isLoading: false 
      });
      throw error; // Re-throw to allow handling in the component
    }
  },
  updateGuestTags: async (guestIds, tagsToAdd, tagsToRemove = []) => {
    try {
      set({ isLoading: true });
      
      // Make API call to update guest tags
      const response = await fetch('/api/guests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestIds, tagsToAdd, tagsToRemove }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update guest tags');
      }
      
      // Optimistically update the store
      set((state) => ({
        guests: state.guests.map(guest => {
          if (guestIds.includes(guest.id)) {
            // Create updated tags by removing those in tagsToRemove and adding those in tagsToAdd
            const updatedTags = [
              ...guest.tags.filter(tag => !tagsToRemove.includes(tag)),
              ...tagsToAdd.filter(tag => !guest.tags.includes(tag))
            ];
            
            return { ...guest, tags: updatedTags };
          }
          return guest;
        }),
        isLoading: false,
      }));
      
      // Clear selection after successful update
      set({ selectedGuests: [] });
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update tags',
        isLoading: false 
      });
      throw error;
    }
  },
  

}));