import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";

// Define protected routes
const PROTECTED_ROUTES = ["/admin"];
const LOGIN_URL = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname.startsWith(route) && pathname !== LOGIN_URL
  );

  // If not a protected route, continue normally
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Check for valid admin session
    const session = await getAdminSessionFromRequest(request);

    if (!session || !session.isAdmin) {
      // No valid session - redirect to login
      const loginUrl = new URL(LOGIN_URL, request.url);

      // Add the attempted URL as a query parameter for redirect after login
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("redirect", pathname);
      }

      console.log(
        `Unauthorized access attempt to ${pathname} at ${new Date().toISOString()}`
      );

      return NextResponse.redirect(loginUrl);
    }

    // Valid session - check if session is still valid (not expired)
    const now = Date.now();
    const sessionAge = now - session.loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (sessionAge > maxAge) {
      // Session expired - redirect to login
      console.log(
        `Expired session access attempt to ${pathname} at ${new Date().toISOString()}`
      );

      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set("expired", "true");

      if (pathname !== "/admin") {
        loginUrl.searchParams.set("redirect", pathname);
      }

      // Clear the expired session cookie
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set({
        name: "admin-session",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });

      return response;
    }

    // Valid session - allow access
    console.log(
      `Authorized access to ${pathname} at ${new Date().toISOString()}`
    );
    return NextResponse.next();
  } catch (error) {
    // Error checking session - redirect to login for security
    console.error(`Middleware error for ${pathname}:`, error);

    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("error", "session_error");

    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
