import { NextResponse } from 'next/server';
import { Guest } from '@/models/guest';
import { v4 as uuidv4 } from 'uuid';
import { generateMockGuests } from './mockData';

var MOCK_GUESTS = generateMockGuests(10000);



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  
  
  // Parse pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  
  // Parse filter parameters
  const status = searchParams.get('status');
  const minFollowers = searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')!) : undefined;
  const maxFollowers = searchParams.get('maxFollowers') ? parseInt(searchParams.get('maxFollowers')!) : undefined;
  const tag = searchParams.get('tag');
  const invitedBefore = searchParams.get('invitedBefore');
  const search = searchParams.get('search');
  
  // Parse sort parameters
  const sortField = searchParams.get('sortField');
  const sortDirection = searchParams.get('sortDirection') || 'asc';

  
  console.log('Sorting by:', sortField, sortDirection);   
  // Apply filters
  let filteredGuests = [...MOCK_GUESTS];
  
  if (status) {
    filteredGuests = filteredGuests.filter(guest => guest.rsvpStatus === status);
  }
  
  if (minFollowers !== undefined) {
    filteredGuests = filteredGuests.filter(guest => guest.followerCount >= minFollowers);
  }
  
  if (maxFollowers !== undefined) {
    filteredGuests = filteredGuests.filter(guest => guest.followerCount <= maxFollowers);
  }
  
  if (tag) {
    filteredGuests = filteredGuests.filter(guest => guest.tags.includes(tag));
  }
  
  if (invitedBefore !== null) {
    const invited = invitedBefore === 'true';
    filteredGuests = filteredGuests.filter(guest => guest.invitedBefore === invited);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredGuests = filteredGuests.filter(
      guest => guest.fullName.toLowerCase().includes(searchLower) ||
               guest.instagramHandle.toLowerCase().includes(searchLower) ||
               guest.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting if parameters exist
  if (sortField) {
    filteredGuests.sort((a, b) => {
      // Handle different field types appropriately
      if (sortField === 'followerCount') {
        // Numeric sort
        return sortDirection === 'asc' 
          ? a.followerCount - b.followerCount 
          : b.followerCount - a.followerCount;
      } else {
        // String sort - handle properties that might be undefined
        let aValue = '';
        let bValue = '';
        
        // Type-safe field access
        if (sortField === 'fullName') {
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
        } else if (sortField === 'rsvpStatus') {
          aValue = a.rsvpStatus.toLowerCase();
          bValue = b.rsvpStatus.toLowerCase();
        } else if (sortField === 'instagramHandle') {
          aValue = a.instagramHandle.toLowerCase();
          bValue = b.instagramHandle.toLowerCase();
        } else if (sortField === 'email') {
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
        } else if (sortField === 'followerCount') {
          aValue = a.followerCount.toString();
          bValue = b.followerCount.toString();
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }
  
  // Apply pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedGuests = filteredGuests.slice(start, end);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({
    guests: paginatedGuests,
    total: filteredGuests.length,
    page,
    limit,
    totalPages: Math.ceil(filteredGuests.length / limit)
  });
}

export async function POST(request: Request) {
    try {
      const guestData = await request.json();
      
      const newGuest = {
        id: `guest-${uuidv4()}`,
        ...guestData,
      };
      
      // Actually add the guest to our mock data
      MOCK_GUESTS = [...MOCK_GUESTS, newGuest];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.json(newGuest, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to create guest' },
        { status: 500 }
      );
    }
  }
  
  // Delete guests
  export async function DELETE(request: Request) {
    try {
      const { ids } = await request.json();
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: 'Invalid request: ids array is required' },
          { status: 400 }
        );
      }
      
      // Actually remove the guests from our mock data
      const initialCount = MOCK_GUESTS.length;
      MOCK_GUESTS = MOCK_GUESTS.filter(guest => !ids.includes(guest.id));
      const deletedCount = initialCount - MOCK_GUESTS.length;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.json({ 
        message: `Successfully deleted ${deletedCount} guests`,
        deletedCount
      });
      
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to delete guests' },
        { status: 500 }
      );
    }
  }
  
  // Update guest tags
  export async function PATCH(request: Request) {
    try {
      const { guestIds, tagsToAdd, tagsToRemove } = await request.json();
      
      if (!Array.isArray(guestIds) || guestIds.length === 0) {
        return NextResponse.json(
          { error: 'Invalid request: guestIds array is required' },
          { status: 400 }
        );
      }
      
      if ((!tagsToAdd || !Array.isArray(tagsToAdd)) && 
          (!tagsToRemove || !Array.isArray(tagsToRemove))) {
        return NextResponse.json(
          { error: 'Invalid request: either tagsToAdd or tagsToRemove array is required' },
          { status: 400 }
        );
      }
      
      // Actually update the guests in our mock data
      MOCK_GUESTS = MOCK_GUESTS.map(guest => {
        if (guestIds.includes(guest.id)) {
          // Create a new tags array with additions and removals
          let updatedTags = [...guest.tags];
          
          // Remove tags that are in tagsToRemove
          if (tagsToRemove && tagsToRemove.length > 0) {
            updatedTags = updatedTags.filter(tag => !tagsToRemove.includes(tag));
          }
          
          // Add tags that are in tagsToAdd and not already in the array
          if (tagsToAdd && tagsToAdd.length > 0) {
            tagsToAdd.forEach((tag: string) => {
              if (!updatedTags.includes(tag)) {
                updatedTags.push(tag);
              }
            });
          }
          
          // Return updated guest
          return {
            ...guest,
            tags: updatedTags
          };
        }
        return guest;
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return updated guests
      const updatedGuests = MOCK_GUESTS.filter(guest => guestIds.includes(guest.id));
      
      return NextResponse.json({ 
        message: `Successfully updated tags for ${guestIds.length} guests`,
        updatedGuests
      });
      
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to update guest tags' },
        { status: 500 }
      );
    }
  }
  