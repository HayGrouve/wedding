import { NextRequest, NextResponse } from "next/server";
import { handleAdminLogin, type AuthResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    // Validate input
    if (!accessCode || typeof accessCode !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Моля въведете код за достъп",
        } as AuthResponse,
        { status: 400 }
      );
    }

    // Attempt login
    const result = await handleAdminLogin(accessCode);

    // Return appropriate response
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Възникна грешка в сървъра",
      } as AuthResponse,
      { status: 500 }
    );
  }
}
