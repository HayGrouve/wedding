import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getAllGuests, getGuestStats } from "@/lib/db";

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

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getAdminSessionFromRequest(request);
    if (!session?.isAdmin) {
      return createErrorResponse("Неоторизиран достъп", 401);
    }

    // Get all guests
    const guestsResult = await getAllGuests();
    if (!guestsResult.success) {
      console.error("Failed to fetch guests:", guestsResult.error);
      return createErrorResponse(
        "Възникна грешка при извличането на данните за гостите",
        500
      );
    }

    // Get guest statistics
    const statsResult = await getGuestStats();
    if (!statsResult.success) {
      console.error("Failed to fetch guest stats:", statsResult.error);
      return createErrorResponse(
        "Възникна грешка при извличането на статистиките",
        500
      );
    }

    // Prepare response data
    const responseData = {
      guests: guestsResult.data || [],
      stats: statsResult.data || {
        totalGuests: 0,
        attendingCount: 0,
        notAttendingCount: 0,
        plusOnesCount: 0,
        totalChildrenCount: 0,
        dietaryPreferences: {},
        allergies: {},
      },
    };

    return createSuccessResponse(
      responseData,
      "Данните за гостите са извлечени успешно"
    );
  } catch (error) {
    console.error("Unexpected error in admin guests API:", error);
    return createErrorResponse(
      "Възникна неочаквана грешка. Моля, опитайте отново.",
      500
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return createErrorResponse("Методът не е поддържан", 405);
}

export async function PUT() {
  return createErrorResponse("Методът не е поддържан", 405);
}

export async function DELETE() {
  return createErrorResponse("Методът не е поддържан", 405);
}

export async function PATCH() {
  return createErrorResponse("Методът не е поддържан", 405);
}
