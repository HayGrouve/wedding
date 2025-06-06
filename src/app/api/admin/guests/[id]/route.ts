import { NextRequest, NextResponse } from "next/server";
import { updateGuest, deleteGuest } from "@/lib/db-redis";
import { getAdminSessionFromRequest } from "@/lib/auth";

// Update a specific guest
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getAdminSessionFromRequest(request);

    if (!session?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: guestId } = await params;
    const updates = await request.json();

    // Validate that we have an ID
    if (!guestId) {
      return NextResponse.json(
        { success: false, error: "Guest ID is required" },
        { status: 400 }
      );
    }

    // Update the guest
    const result = await updateGuest(guestId, updates);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === "Guest not found" ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error updating guest:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a specific guest
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getAdminSessionFromRequest(request);

    if (!session?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: guestId } = await params;

    // Validate that we have an ID
    if (!guestId) {
      return NextResponse.json(
        { success: false, error: "Guest ID is required" },
        { status: 400 }
      );
    }

    // Delete the guest
    const result = await deleteGuest(guestId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === "Guest not found" ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Guest deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting guest:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
