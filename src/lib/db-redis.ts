import { createClient } from "redis";

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
  childrenDetails?: { name: string; age: number }[];
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

// Redis Keys
const GUESTS_KEY = "wedding:guests";
const RATE_LIMIT_PREFIX = "wedding:ratelimit:";
const GUEST_EMAIL_PREFIX = "wedding:guest:email:";

// Redis client instance
let redis: ReturnType<typeof createClient> | null = null;

// Initialize Redis connection
async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
    });

    redis.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redis.on("connect", () => {
      console.log("Redis Client Connected");
    });

    redis.on("disconnect", () => {
      console.log("Redis Client Disconnected");
    });

    await redis.connect();
  }

  return redis;
}

// Generate unique ID for guests
export function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Read all guests from Redis storage
export async function getAllGuests(): Promise<DatabaseResponse<GuestRecord[]>> {
  try {
    const client = await getRedisClient();
    const guestsJson = await client.get(GUESTS_KEY);

    const guests = guestsJson ? JSON.parse(guestsJson) : [];

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

// Add new guest to Redis storage
export async function addGuest(
  guest: Omit<GuestRecord, "id">
): Promise<DatabaseResponse<GuestRecord>> {
  try {
    const client = await getRedisClient();

    // Get existing guests
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

    // Save to Redis
    await client.set(GUESTS_KEY, JSON.stringify(guests));

    // Also store email index for quick lookup
    await client.set(
      `${GUEST_EMAIL_PREFIX}${newGuest.email.toLowerCase()}`,
      newGuest.id
    );

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
    const client = await getRedisClient();

    // First check if email exists in index
    const guestId = await client.get(
      `${GUEST_EMAIL_PREFIX}${email.toLowerCase()}`
    );

    if (!guestId) {
      return {
        success: true,
        data: undefined,
      };
    }

    // Get all guests and find by ID
    const result = await getAllGuests();
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    const guest = result.data?.find((g) => g.id === guestId);

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
    const client = await getRedisClient();

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

    // Save back to Redis
    await client.set(GUESTS_KEY, JSON.stringify(guests));

    // Update email index if email changed
    if (updates.email && updates.email !== guests[guestIndex].email) {
      // Remove old email index
      await client.del(
        `${GUEST_EMAIL_PREFIX}${guests[guestIndex].email.toLowerCase()}`
      );
      // Add new email index
      await client.set(
        `${GUEST_EMAIL_PREFIX}${updates.email.toLowerCase()}`,
        id
      );
    }

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
    const client = await getRedisClient();

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

    const guestToDelete = guests[guestIndex];

    // Remove from array
    guests.splice(guestIndex, 1);

    // Save back to Redis
    await client.set(GUESTS_KEY, JSON.stringify(guests));

    // Remove email index
    await client.del(
      `${GUEST_EMAIL_PREFIX}${guestToDelete.email.toLowerCase()}`
    );

    console.log(
      `Guest deleted: ${guestToDelete.guestName} (${guestToDelete.email})`
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

// Bulk update guest attending status
export async function bulkUpdateGuestAttending(
  guestIds: string[],
  attending: boolean
): Promise<DatabaseResponse<number>> {
  try {
    const client = await getRedisClient();

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
        updatedCount++;
      }
    });

    if (updatedCount === 0) {
      return {
        success: false,
        error: "No guests found to update",
      };
    }

    // Save back to Redis
    await client.set(GUESTS_KEY, JSON.stringify(guests));

    console.log(
      `Bulk updated ${updatedCount} guests attending status to: ${attending}`
    );

    return {
      success: true,
      data: updatedCount,
    };
  } catch (error) {
    console.error("Error bulk updating guests:", error);
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
    const client = await getRedisClient();

    // Read existing guests
    const existingResult = await getAllGuests();
    if (!existingResult.success) {
      throw new Error(existingResult.error);
    }

    const guests = existingResult.data || [];
    const guestsToDelete = guests.filter((guest) =>
      guestIds.includes(guest.id)
    );
    const remainingGuests = guests.filter(
      (guest) => !guestIds.includes(guest.id)
    );

    if (guestsToDelete.length === 0) {
      return {
        success: false,
        error: "No guests found to delete",
      };
    }

    // Save remaining guests to Redis
    await client.set(GUESTS_KEY, JSON.stringify(remainingGuests));

    // Remove email indexes for deleted guests
    for (const guest of guestsToDelete) {
      await client.del(`${GUEST_EMAIL_PREFIX}${guest.email.toLowerCase()}`);
    }

    console.log(`Bulk deleted ${guestsToDelete.length} guests`);

    return {
      success: true,
      data: guestsToDelete.length,
    };
  } catch (error) {
    console.error("Error bulk deleting guests:", error);
    return {
      success: false,
      error: "Failed to bulk delete guests",
    };
  }
}

// Rate limiting implementation
interface RateLimitRecord {
  count: number;
  firstAttempt: string; // ISO string
  lastAttempt: string; // ISO string
}

export async function checkRateLimit(
  ipAddress: string,
  maxAttempts: number = 3,
  windowHours: number = 1
): Promise<DatabaseResponse<boolean>> {
  try {
    const client = await getRedisClient();
    const rateLimitKey = `${RATE_LIMIT_PREFIX}${ipAddress}`;
    const recordJson = await client.get(rateLimitKey);

    if (!recordJson) {
      // No previous attempts
      return {
        success: true,
        data: true,
      };
    }

    const record: RateLimitRecord = JSON.parse(recordJson);
    const now = new Date();
    const firstAttempt = new Date(record.firstAttempt);
    const windowMs = windowHours * 60 * 60 * 1000;

    // Check if we're still within the rate limit window
    if (now.getTime() - firstAttempt.getTime() > windowMs) {
      // Window has expired, allow the request
      return {
        success: true,
        data: true,
      };
    }

    // Check if we've exceeded the limit
    if (record.count >= maxAttempts) {
      return {
        success: true,
        data: false,
      };
    }

    // Within limits
    return {
      success: true,
      data: true,
    };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return {
      success: false,
      error: "Failed to check rate limit",
    };
  }
}

export async function updateRateLimit(
  ipAddress: string
): Promise<DatabaseResponse<void>> {
  try {
    const client = await getRedisClient();
    const rateLimitKey = `${RATE_LIMIT_PREFIX}${ipAddress}`;
    const recordJson = await client.get(rateLimitKey);
    const now = new Date().toISOString();

    if (!recordJson) {
      // First attempt
      const newRecord: RateLimitRecord = {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      };
      await client.set(rateLimitKey, JSON.stringify(newRecord));
      await client.expire(rateLimitKey, 60 * 60); // Expire in 1 hour
    } else {
      // Update existing record
      const record: RateLimitRecord = JSON.parse(recordJson);
      const updatedRecord: RateLimitRecord = {
        ...record,
        count: record.count + 1,
        lastAttempt: now,
      };
      await client.set(rateLimitKey, JSON.stringify(updatedRecord));
      await client.expire(rateLimitKey, 60 * 60); // Expire in 1 hour
    }

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

// Health check
export async function healthCheck(): Promise<
  DatabaseResponse<{ status: string; message: string }>
> {
  try {
    const client = await getRedisClient();

    // Test Redis connection with a simple ping
    const pong = await client.ping();

    if (pong === "PONG") {
      // Try to get guests to test full functionality
      const result = await getAllGuests();

      if (result.success) {
        return {
          success: true,
          data: {
            status: "healthy",
            message: `Redis database is working. Found ${result.count} guests.`,
          },
        };
      } else {
        return {
          success: false,
          data: {
            status: "unhealthy",
            message: "Failed to read from Redis database",
          },
          error: result.error,
        };
      }
    } else {
      return {
        success: false,
        data: {
          status: "unhealthy",
          message: "Redis ping failed",
        },
        error: "Redis connection issue",
      };
    }
  } catch (error) {
    console.error("Health check failed:", error);
    return {
      success: false,
      data: {
        status: "unhealthy",
        message: "Health check failed",
      },
      error: "Database health check failed",
    };
  }
}

// Get guest statistics
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
      totalChildrenCount: guests.reduce(
        (sum, g) => sum + (g.childrenCount || 0),
        0
      ),
      dietaryPreferences: {} as Record<string, number>,
      allergies: {} as Record<string, number>,
    };

    // Count dietary preferences
    guests.forEach((guest) => {
      if (guest.dietaryPreference) {
        stats.dietaryPreferences[guest.dietaryPreference] =
          (stats.dietaryPreferences[guest.dietaryPreference] || 0) + 1;
      }
    });

    // Count allergies
    guests.forEach((guest) => {
      if (guest.allergies && guest.allergies.trim()) {
        const allergy = guest.allergies.trim().toLowerCase();
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

// Cleanup function to disconnect Redis when needed
export async function disconnectRedis(): Promise<void> {
  try {
    if (redis) {
      await redis.disconnect();
      redis = null;
      console.log("Redis client disconnected");
    }
  } catch (error) {
    console.error("Error disconnecting Redis:", error);
  }
}
