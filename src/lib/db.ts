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
      return result;
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
      return result;
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
