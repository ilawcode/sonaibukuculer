import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";

// PATCH /api/actions/:id — Aksiyon güncelle (status vb.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const action = await Action.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Aksiyon bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: action });
  } catch (error) {
    console.error("PATCH /api/actions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/actions/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const action = await Action.findByIdAndDelete(params.id);

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Aksiyon bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/actions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon silinemedi" },
      { status: 500 }
    );
  }
}
