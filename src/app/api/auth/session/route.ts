import { NextResponse } from "next/server";
import { getSessionInfo } from "@/lib/auth";

export async function GET() {
  try {
    const sessionInfo = await getSessionInfo();

    if (!sessionInfo) {
      return NextResponse.json(
        {
          isAuthenticated: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(sessionInfo, { status: 200 });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        error: "Възникна грешка при проверката на сесията",
      },
      { status: 500 }
    );
  }
}
