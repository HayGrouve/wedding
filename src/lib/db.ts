import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Types for our database operations
export interface GuestRecord {
  id: string;
  guestName: string;
  email: string;
  phone?: string;
  attending: boolean;
  plusOneAttending: boolean;
  plusOneName?: string;
  childrenCount: number;
  dietaryPreference?: string;
  allergies?: string;
  submissionDate: string; // ISO string
  ipAddress?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DatabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Database configuration
const DB_DIR = path.join(process.cwd(), "data");
const GUESTS_FILE = path.join(DB_DIR, "guests.json");
const RATE_LIMIT_FILE = path.join(DB_DIR, "rate-limits.json");

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true });
  }
}

// Initialize database files if they don't exist
async function initializeDatabase(): Promise<void> {
  await ensureDataDir();

  if (!existsSync(GUESTS_FILE)) {
    await writeFile(GUESTS_FILE, JSON.stringify([], null, 2));
  }

  if (!existsSync(RATE_LIMIT_FILE)) {
    await writeFile(RATE_LIMIT_FILE, JSON.stringify({}, null, 2));
  }
}

// Generate unique ID for guests
export function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Read all guests from storage
export async function getAllGuests(): Promise<DatabaseResponse<GuestRecord[]>> {
  try {
    await initializeDatabase();
    const data = await readFile(GUESTS_FILE, "utf-8");
    const guests: GuestRecord[] = JSON.parse(data);

    return {
      success: true,
      data: guests,
      count: guests.length,
    };
  } catch (error) {
    console.error("Error reading guests data:", error);
    return {
      success: false,
      error: "Failed to read guest data",
    };
  }
}

// Add new guest to storage
export async function addGuest(
  guest: Omit<GuestRecord, "id">
): Promise<DatabaseResponse<GuestRecord>> {
  try {
    await initializeDatabase();

    // Read existing guests
    const existingResult = await getAllGuests();
    if (!existingResult.success) {
      throw new Error(existingResult.error);
    }

    const guests = existingResult.data || [];

    // Create new guest record
    const newGuest: GuestRecord = {
      id: generateGuestId(),
      ...guest,
      submissionDate: new Date().toISOString(),
    };

    // Add to array
    guests.push(newGuest);

    // Write back to file
    await writeFile(GUESTS_FILE, JSON.stringify(guests, null, 2));

    console.log(`New guest added: ${newGuest.guestName} (${newGuest.email})`);

    return {
      success: true,
      data: newGuest,
    };
  } catch (error) {
    console.error("Error adding guest:", error);
    return {
      success: false,
      error: "Failed to add guest",
    };
  }
}

// Find guest by email
export async function findGuestByEmail(
  email: string
): Promise<DatabaseResponse<GuestRecord>> {
  try {
    const result = await getAllGuests();
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    const guest = result.data?.find(
      (g) => g.email.toLowerCase() === email.toLowerCase()
    );

    return {
      success: true,
      data: guest,
    };
  } catch (error) {
    console.error("Error finding guest by email:", error);
    return {
      success: false,
      error: "Failed to find guest",
    };
  }
}

// Update guest by ID
export async function updateGuest(
  id: string,
  updates: Partial<Omit<GuestRecord, "id" | "submissionDate">>
): Promise<DatabaseResponse<GuestRecord>> {
  try {
    await initializeDatabase();

    // Read existing guests
    const existingResult = await getAllGuests();
    if (!existingResult.success) {
      throw new Error(existingResult.error);
    }

    const guests = existingResult.data || [];
    const guestIndex = guests.findIndex((g) => g.id === id);

    if (guestIndex === -1) {
      return {
        success: false,
        error: "Guest not found",
      };
    }

    // Update the guest record
    const updatedGuest: GuestRecord = {
      ...guests[guestIndex],
      ...updates,
    };

    guests[guestIndex] = updatedGuest;

    // Write back to file
    await writeFile(GUESTS_FILE, JSON.stringify(guests, null, 2));

    console.log(
      `Guest updated: ${updatedGuest.guestName} (${updatedGuest.email})`
    );

    return {
      success: true,
      data: updatedGuest,
    };
  } catch (error) {
    console.error("Error updating guest:", error);
    return {
      success: false,
      error: "Failed to update guest",
    };
  }
}

// Delete guest by ID
export async function deleteGuest(id: string): Promise<DatabaseResponse<void>> {
  try {
    await initializeDatabase();

    // Read existing guests
    const existingResult = await getAllGuests();
    if (!existingResult.success) {
      throw new Error(existingResult.error);
    }

    const guests = existingResult.data || [];
    const guestIndex = guests.findIndex((g) => g.id === id);

    if (guestIndex === -1) {
      return {
        success: false,
        error: "Guest not found",
      };
    }

    const deletedGuest = guests[guestIndex];
    guests.splice(guestIndex, 1);

    // Write back to file
    await writeFile(GUESTS_FILE, JSON.stringify(guests, null, 2));

    console.log(
      `Guest deleted: ${deletedGuest.guestName} (${deletedGuest.email})`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return {
      success: false,
      error: "Failed to delete guest",
    };
  }
}

// Bulk update guests attending status
export async function bulkUpdateGuestAttending(
  guestIds: string[],
  attending: boolean
): Promise<DatabaseResponse<number>> {
  try {
    await initializeDatabase();

    // Read existing guests
    const existingResult = await getAllGuests();
    if (!existingResult.success) {
      throw new Error(existingResult.error);
    }

    const guests = existingResult.data || [];
    let updatedCount = 0;

    // Update each guest
    guests.forEach((guest) => {
      if (guestIds.includes(guest.id)) {
        guest.attending = attending;
        // If not attending, clear dependent fields
        if (!attending) {
          guest.plusOneAttending = false;
          guest.plusOneName = undefined;
          guest.childrenCount = 0;
          guest.dietaryPreference = undefined;
          guest.allergies = undefined;
        }
        updatedCount++;
      }
    });

    // Write back to file
    await writeFile(GUESTS_FILE, JSON.stringify(guests, null, 2));

    console.log(
      `Bulk updated ${updatedCount} guests attending status to: ${attending}`
    );

    return {
      success: true,
      data: updatedCount,
    };
  } catch (error) {
    console.error("Error bulk updating guest attending:", error);
    return {
      success: false,
      error: "Failed to bulk update guests",
    };
  }
}

// Bulk delete guests
export async function bulkDeleteGuests(
  guestIds: string[]
): Promise<DatabaseResponse<number>> {
  try {
    await initializeDatabase();

    // Read existing guests
    const existingResult = await getAllGuests();
    if (!existingResult.success) {
      throw new Error(existingResult.error);
    }

    const guests = existingResult.data || [];
    const initialCount = guests.length;

    // Filter out guests to be deleted
    const filteredGuests = guests.filter(
      (guest) => !guestIds.includes(guest.id)
    );
    const deletedCount = initialCount - filteredGuests.length;

    // Write back to file
    await writeFile(GUESTS_FILE, JSON.stringify(filteredGuests, null, 2));

    console.log(`Bulk deleted ${deletedCount} guests`);

    return {
      success: true,
      data: deletedCount,
    };
  } catch (error) {
    console.error("Error bulk deleting guests:", error);
    return {
      success: false,
      error: "Failed to bulk delete guests",
    };
  }
}

// Rate limiting utilities
interface RateLimitRecord {
  [ipAddress: string]: {
    count: number;
    firstAttempt: string; // ISO string
    lastAttempt: string; // ISO string
  };
}

export async function checkRateLimit(
  ipAddress: string,
  maxAttempts: number = 3,
  windowHours: number = 1
): Promise<DatabaseResponse<boolean>> {
  try {
    await initializeDatabase();

    const data = await readFile(RATE_LIMIT_FILE, "utf-8");
    const rateLimits: RateLimitRecord = JSON.parse(data);

    const now = new Date();
    const windowStart = new Date(now.getTime() - windowHours * 60 * 60 * 1000);

    const record = rateLimits[ipAddress];

    if (!record) {
      // First attempt from this IP
      return {
        success: true,
        data: true, // allowed
      };
    }

    const firstAttempt = new Date(record.firstAttempt);

    // If the window has expired, reset the counter
    if (firstAttempt < windowStart) {
      return {
        success: true,
        data: true, // allowed
      };
    }

    // Check if exceeded rate limit
    const allowed = record.count < maxAttempts;

    return {
      success: true,
      data: allowed,
    };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return {
      success: false,
      error: "Failed to check rate limit",
    };
  }
}

// Update rate limit counter
export async function updateRateLimit(
  ipAddress: string
): Promise<DatabaseResponse<void>> {
  try {
    await initializeDatabase();

    const data = await readFile(RATE_LIMIT_FILE, "utf-8");
    const rateLimits: RateLimitRecord = JSON.parse(data);

    const now = new Date().toISOString();

    if (!rateLimits[ipAddress]) {
      rateLimits[ipAddress] = {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      };
    } else {
      rateLimits[ipAddress].count++;
      rateLimits[ipAddress].lastAttempt = now;
    }

    await writeFile(RATE_LIMIT_FILE, JSON.stringify(rateLimits, null, 2));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating rate limit:", error);
    return {
      success: false,
      error: "Failed to update rate limit",
    };
  }
}

// Database health check
export async function healthCheck(): Promise<
  DatabaseResponse<{ status: string; message: string }>
> {
  try {
    await initializeDatabase();

    // Test read operation
    const result = await getAllGuests();
    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      data: {
        status: "healthy",
        message: `Database operational. ${result.count} guests in database.`,
      },
    };
  } catch (error) {
    console.error("Database health check failed:", error);
    return {
      success: false,
      data: {
        status: "unhealthy",
        message: "Database connection failed",
      },
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get guest statistics for admin dashboard
export async function getGuestStats(): Promise<
  DatabaseResponse<{
    totalGuests: number;
    attendingCount: number;
    notAttendingCount: number;
    plusOnesCount: number;
    totalChildrenCount: number;
    dietaryPreferences: Record<string, number>;
    allergies: Record<string, number>;
  }>
> {
  try {
    const result = await getAllGuests();
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    const guests = result.data || [];

    const stats = {
      totalGuests: guests.length,
      attendingCount: guests.filter((g) => g.attending).length,
      notAttendingCount: guests.filter((g) => !g.attending).length,
      plusOnesCount: guests.filter((g) => g.plusOneAttending).length,
      totalChildrenCount: guests.reduce((sum, g) => sum + g.childrenCount, 0),
      dietaryPreferences: {} as Record<string, number>,
      allergies: {} as Record<string, number>,
    };

    // Count dietary preferences
    guests.forEach((guest) => {
      if (guest.dietaryPreference && guest.dietaryPreference.trim()) {
        const pref = guest.dietaryPreference.trim();
        stats.dietaryPreferences[pref] =
          (stats.dietaryPreferences[pref] || 0) + 1;
      }
    });

    // Count allergies
    guests.forEach((guest) => {
      if (guest.allergies && guest.allergies.trim()) {
        const allergy = guest.allergies.trim();
        stats.allergies[allergy] = (stats.allergies[allergy] || 0) + 1;
      }
    });

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error getting guest stats:", error);
    return {
      success: false,
      error: "Failed to get guest statistics",
    };
  }
}
