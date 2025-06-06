import { NextRequest, NextResponse } from "next/server";
import { validateRSVPForm, sanitizeGuestData } from "@/lib/validations";
import {
  addGuest,
  checkRateLimit,
  updateRateLimit,
  findGuestByEmail,
} from "@/lib/db";

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers (for production deployment)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback for unknown IP
  return "unknown";
}

// Helper function to create error response
function createErrorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
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

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limiting (3 submissions per hour)
    const rateLimitResult = await checkRateLimit(clientIP, 3, 1);
    if (!rateLimitResult.success) {
      console.error("Rate limit check failed:", rateLimitResult.error);
      return createErrorResponse(
        "Възникна техническа грешка. Моля, опитайте отново.",
        500
      );
    }

    if (!rateLimitResult.data) {
      return createErrorResponse(
        "Превишихте лимита за подаване на формуляри. Моля, опитайте отново след 1 час.",
        429
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse("Невалидни данни в заявката");
    }

    // Validate form data
    const validation = validateRSVPForm(body);
    if (!validation.success) {
      return createErrorResponse(
        "Моля, коригирайте грешките във формуляра",
        400,
        validation.errors
      );
    }

    // Sanitize data
    const sanitizedData = sanitizeGuestData(validation.data);

    // Check if guest already exists (by email)
    const existingGuestResult = await findGuestByEmail(sanitizedData.email);
    if (!existingGuestResult.success) {
      console.error(
        "Database error checking existing guest:",
        existingGuestResult.error
      );
      return createErrorResponse(
        "Възникна техническа грешка. Моля, опитайте отново.",
        500
      );
    }

    if (existingGuestResult.data) {
      return createErrorResponse(
        "Вече сте изпратили RSVP с този email адрес. Ако искате да промените отговора си, моля свържете се с нас.",
        409
      );
    }

    // Prepare guest data for storage
    const guestData = {
      ...sanitizedData,
      ipAddress: clientIP,
      submissionDate: new Date().toISOString(),
    };

    // Save to database
    const saveResult = await addGuest(guestData);
    if (!saveResult.success) {
      console.error("Database error saving guest:", saveResult.error);
      return createErrorResponse(
        "Възникна техническа грешка. Моля, опитайте отново.",
        500
      );
    }

    // Update rate limit counter
    const rateLimitUpdateResult = await updateRateLimit(clientIP);
    if (!rateLimitUpdateResult.success) {
      console.warn(
        "Failed to update rate limit for IP:",
        clientIP,
        rateLimitUpdateResult.error
      );
      // Don't fail the request if rate limit update fails
    }

    // Prepare response data (exclude sensitive information)
    const responseData = {
      id: saveResult.data?.id,
      guestName: saveResult.data?.guestName,
      attending: saveResult.data?.attending,
      submissionDate: saveResult.data?.submissionDate,
    };

    // Log successful submission (for monitoring)
    console.log(
      `RSVP submission successful: ${sanitizedData.guestName} (${sanitizedData.email}) - Attending: ${sanitizedData.attending}`
    );

    return createSuccessResponse(
      responseData,
      sanitizedData.attending
        ? "Благодарим ви! RSVP-то ви е получено. Очакваме ви с нетърпение!"
        : "Благодарим ви за отговора! Съжаляваме, че няма да можете да присъствате."
    );
  } catch (error) {
    console.error("Unexpected error in RSVP API:", error);
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
