import { NextRequest, NextResponse } from "next/server";
import { validateAdminQuery } from "@/lib/validations";
import { getAllGuests, getGuestStats } from "@/lib/db";

// Simple authentication (for production, use proper JWT/session)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "svatba2024";

// Helper function to create error response
function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

// Helper function to create success response
function createSuccessResponse(data: unknown, message?: string) {
  return NextResponse.json({
    success: true,
    message,
    data,
  });
}

// Check basic authentication
function checkAuthentication(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const password = authHeader.substring(7); // Remove "Bearer " prefix
  return password === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuthentication(request)) {
      return createErrorResponse("Неоторизиран достъп", 401);
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      filterAttending: searchParams.get("filterAttending"),
    };

    const validation = validateAdminQuery(queryParams);
    if (!validation.success) {
      return createErrorResponse("Невалидни параметри на заявката", 400);
    }

    const { page, limit, sortBy, sortOrder, filterAttending } = validation.data;

    // Get all guests from database
    const guestsResult = await getAllGuests();
    if (!guestsResult.success) {
      console.error("Database error fetching guests:", guestsResult.error);
      return createErrorResponse(
        "Възникна техническа грешка при извличане на данните",
        500
      );
    }

    let guests = guestsResult.data || [];

    // Apply filtering
    if (filterAttending !== undefined) {
      guests = guests.filter((guest) => guest.attending === filterAttending);
    }

    // Apply sorting
    guests.sort((a, b) => {
      let aValue: string | number | boolean;
      let bValue: string | number | boolean;

      switch (sortBy) {
        case "guestName":
          aValue = a.guestName.toLowerCase();
          bValue = b.guestName.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "attending":
          aValue = a.attending;
          bValue = b.attending;
          break;
        case "submissionDate":
        default:
          aValue = new Date(a.submissionDate).getTime();
          bValue = new Date(b.submissionDate).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const totalGuests = guests.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGuests = guests.slice(startIndex, endIndex);

    // Get statistics
    const statsResult = await getGuestStats();
    const stats = statsResult.success ? statsResult.data : null;

    // Format response data
    const responseData = {
      guests: paginatedGuests.map((guest) => ({
        id: guest.id,
        guestName: guest.guestName,
        email: guest.email,
        phone: guest.phone,
        attending: guest.attending,
        plusOneAttending: guest.plusOneAttending,
        plusOneName: guest.plusOneName,
        childrenCount: guest.childrenCount,
        dietaryPreference: guest.dietaryPreference,
        allergies: guest.allergies,
        submissionDate: guest.submissionDate,
        // Don't expose IP address in admin response for privacy
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalGuests / limit),
        totalGuests,
        guestsPerPage: limit,
        hasNextPage: endIndex < totalGuests,
        hasPrevPage: page > 1,
      },
      stats: stats
        ? {
            totalGuests: stats.totalGuests,
            attendingCount: stats.attendingCount,
            notAttendingCount: stats.notAttendingCount,
            plusOnesCount: stats.plusOnesCount,
            totalChildrenCount: stats.totalChildrenCount,
            dietaryPreferences: stats.dietaryPreferences,
            allergiesCount: Object.keys(stats.allergies).length,
            // Group dietary preferences for better display
            dietarySummary: {
              standard: stats.dietaryPreferences?.standard || 0,
              vegetarian: stats.dietaryPreferences?.vegetarian || 0,
            },
          }
        : null,
    };

    console.log(
      `Admin dashboard: Retrieved ${paginatedGuests.length} guests (page ${page}/${Math.ceil(totalGuests / limit)})`
    );

    return createSuccessResponse(responseData, "Данните са извлечени успешно");
  } catch (error) {
    console.error("Unexpected error in admin guests API:", error);
    return createErrorResponse("Възникна неочаквана грешка", 500);
  }
}

// Handle authentication for other methods
export async function POST(request: NextRequest) {
  if (!checkAuthentication(request)) {
    return createErrorResponse("Неоторизиран достъп", 401);
  }
  return createErrorResponse("Методът не е поддържан", 405);
}

export async function PUT(request: NextRequest) {
  if (!checkAuthentication(request)) {
    return createErrorResponse("Неоторизиран достъп", 401);
  }
  return createErrorResponse("Методът не е поддържан", 405);
}

export async function DELETE(request: NextRequest) {
  if (!checkAuthentication(request)) {
    return createErrorResponse("Неоторизиран достъп", 401);
  }
  return createErrorResponse("Методът не е поддържан", 405);
}

export async function PATCH(request: NextRequest) {
  if (!checkAuthentication(request)) {
    return createErrorResponse("Неоторизиран достъп", 401);
  }
  return createErrorResponse("Методът не е поддържан", 405);
}
