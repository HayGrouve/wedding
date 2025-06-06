import { NextRequest, NextResponse } from "next/server";
import { handleAdminLogout } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Handle logout and redirect to home page for direct URL visits
    await handleAdminLogout();

    // Get redirect URL from query parameter, default to home
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get("redirect") || "/";

    // Redirect to home page or specified URL
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error("Logout GET error:", error);
    // Even on error, redirect to home for security
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    await handleAdminLogout();

    // Check if client wants a redirect instead of JSON response
    const { searchParams } = new URL(request.url);
    const shouldRedirect = searchParams.get("redirect");

    if (shouldRedirect) {
      const redirectTo = shouldRedirect === "true" ? "/" : shouldRedirect;
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // Default JSON response for AJAX calls
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout POST error:", error);

    // Check if client wants a redirect on error
    const { searchParams } = new URL(request.url);
    const shouldRedirect = searchParams.get("redirect");

    if (shouldRedirect) {
      // Even on error, redirect to home for security
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.json(
      {
        success: false,
        error: "Възникна грешка при излизането",
      },
      { status: 500 }
    );
  }
}
