import { NextRequest, NextResponse } from "next/server";
import { bulkDeleteGuests, bulkUpdateGuestAttending } from "@/lib/db";
import { getAdminSessionFromRequest } from "@/lib/auth";

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

// Bulk actions for guests
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getAdminSessionFromRequest(request);

    if (!session?.isAdmin) {
      return createErrorResponse("Неоторизиран достъп", 401);
    }

    const body = await request.json();
    const { action, guestIds } = body;

    // Validate input
    if (
      !action ||
      !guestIds ||
      !Array.isArray(guestIds) ||
      guestIds.length === 0
    ) {
      return createErrorResponse(
        "Невалидни параметри за групово действие",
        400
      );
    }

    switch (action) {
      case "delete": {
        const result = await bulkDeleteGuests(guestIds);

        if (!result.success) {
          console.error("Failed to bulk delete guests:", result.error);
          return createErrorResponse(
            "Възникна грешка при изтриването на гостите",
            500
          );
        }

        return createSuccessResponse(
          { deletedCount: result.data },
          `Успешно изтрити ${result.data} гост${result.data === 1 ? "" : "и"}`
        );
      }

      case "markAttending": {
        const { attending } = body;

        if (typeof attending !== "boolean") {
          return createErrorResponse("Невалиден статус на присъствие", 400);
        }

        const result = await bulkUpdateGuestAttending(guestIds, attending);

        if (!result.success) {
          console.error(
            "Failed to bulk update guest attendance:",
            result.error
          );
          return createErrorResponse(
            "Възникна грешка при обновяването на статуса",
            500
          );
        }

        const action = attending ? "потвърдени" : "отхвърлени";
        return createSuccessResponse(
          { updatedCount: result.data },
          `Успешно ${action} ${result.data} гост${result.data === 1 ? "" : "и"}`
        );
      }

      default:
        return createErrorResponse("Неподдържано групово действие", 400);
    }
  } catch (error) {
    console.error("Unexpected error in bulk guests API:", error);
    return createErrorResponse(
      "Възникна неочаквана грешка. Моля, опитайте отново.",
      500
    );
  }
}

// Handle unsupported methods
export async function GET() {
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
