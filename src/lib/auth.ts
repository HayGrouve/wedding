import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);
const JWT_ALGORITHM = "HS256";
const TOKEN_EXPIRY = "24h"; // 24 hours
const COOKIE_NAME = "admin-session";

// Admin access code from environment
const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE || "admin123";

// Interface for JWT payload - extending jose's JWTPayload
interface CustomJWTPayload {
  isAdmin: boolean;
  loginTime: number;
  [key: string]: unknown; // Index signature for jose compatibility
}

/**
 * Verify if the provided access code is correct
 */
export function verifyAccessCode(accessCode: string): boolean {
  return accessCode === ADMIN_ACCESS_CODE;
}

/**
 * Generate a JWT token for authenticated admin
 */
export async function generateAdminToken(): Promise<string> {
  const payload: CustomJWTPayload = {
    isAdmin: true,
    loginTime: Date.now(),
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT token and return the payload
 */
export async function verifyToken(
  token: string
): Promise<CustomJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Validate payload structure
    if (
      typeof payload.isAdmin === "boolean" &&
      typeof payload.loginTime === "number" &&
      payload.isAdmin === true
    ) {
      return payload as CustomJWTPayload;
    }

    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(): Promise<void> {
  const token = await generateAdminToken();
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    path: "/",
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Get admin session from cookies
 */
export async function getAdminSession(): Promise<CustomJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token?.value) {
      return null;
    }

    return await verifyToken(token.value);
  } catch (error) {
    console.error("Failed to get admin session:", error);
    return null;
  }
}

/**
 * Get admin session from request (for middleware)
 */
export async function getAdminSessionFromRequest(
  request: NextRequest
): Promise<CustomJWTPayload | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME);

    if (!token?.value) {
      return null;
    }

    return await verifyToken(token.value);
  } catch (error) {
    console.error("Failed to get admin session from request:", error);
    return null;
  }
}

/**
 * Check if user is authenticated admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.isAdmin === true;
}

/**
 * Authentication response type for API routes
 */
export interface AuthResponse {
  success: boolean;
  error?: string;
}

/**
 * Handle admin login
 */
export async function handleAdminLogin(
  accessCode: string
): Promise<AuthResponse> {
  try {
    if (!verifyAccessCode(accessCode)) {
      // Log failed attempt
      console.warn(`Failed admin login attempt at ${new Date().toISOString()}`);
      return {
        success: false,
        error: "Неправилен код за достъп",
      };
    }

    // Set session cookie
    await setAdminSession();

    // Log successful login
    console.log(`Successful admin login at ${new Date().toISOString()}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      error: "Възникна грешка при влизането",
    };
  }
}

/**
 * Handle admin logout
 */
export async function handleAdminLogout(): Promise<void> {
  try {
    await clearAdminSession();
    console.log(`Admin logout at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Admin logout error:", error);
  }
}

/**
 * Get session info for admin dashboard
 */
export async function getSessionInfo(): Promise<{
  isAuthenticated: boolean;
  loginTime?: number;
  timeRemaining?: number;
} | null> {
  try {
    const session = await getAdminSession();

    if (!session) {
      return {
        isAuthenticated: false,
      };
    }

    const now = Date.now();
    const loginTime = session.loginTime;
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const timeRemaining = Math.max(0, loginTime + sessionDuration - now);

    return {
      isAuthenticated: true,
      loginTime,
      timeRemaining,
    };
  } catch (error) {
    console.error("Failed to get session info:", error);
    return null;
  }
}
