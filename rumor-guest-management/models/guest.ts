export interface Guest {
    id: string;
    fullName: string;
    rsvpStatus: 'attending' | 'declined' | 'pending' | 'invited';
    instagramHandle: string;
    followerCount: number;
    tags: string[];
    email: string;
    phone?: string;
    invitedBefore: boolean;
    notes?: string;
  }
