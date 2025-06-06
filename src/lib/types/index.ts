// Guest RSVP Data Model
export interface GuestRSVP {
  id: string;
  guestName: string;
  email?: string;
  phone?: string;
  attending: boolean;
  plusOneAttending: boolean;
  childrenCount: number;
  dietaryPreference: "vegetarian" | "standard";
  allergies: string;
  submissionDate: Date;
  ipAddress?: string;
}

// Admin Access Model
export interface AdminAccess {
  accessCode: string;
  lastAccess: Date;
  accessCount: number;
}

// Wedding Details
export interface WeddingDetails {
  coupleNames: {
    bride: string;
    groom: string;
  };
  date: Date;
  time: string;
  venue: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  description?: string;
}

// Form validation schemas will be added with Zod later
