export interface ChildDetail {
  name: string;
  age: number;
}

export interface GuestRecord {
  id: string;
  guestName: string;
  email: string;
  phone?: string;
  attending: boolean;
  plusOneAttending: boolean;
  plusOneName?: string;
  childrenCount: number;
  childrenDetails?: ChildDetail[];
  dietaryPreference?: string;
  menuChoice?: string;
  plusOneMenuChoice?: string;
  allergies?: string;
  submissionDate: string; // ISO string
  ipAddress?: string;
}

export interface GuestStats {
  totalGuests: number;
  attendingCount: number;
  notAttendingCount: number;
  plusOnesCount: number;
  totalChildrenCount: number;
  dietaryPreferences: Record<string, number>;
  allergies: Record<string, number>;
}

export interface AdminData {
  guests: GuestRecord[];
  stats: GuestStats;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: keyof GuestRecord;
  direction: SortDirection;
}

export interface FilterConfig {
  attending?: boolean | null;
  hasChildren?: boolean | null;
  hasPlusOne?: boolean | null;
  search?: string;
}
