import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// GET /api/sessions/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await Session.findById(params.id);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("GET /api/sessions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum alınamadı" },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const session = await Session.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("PATCH /api/sessions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await Session.findByIdAndDelete(params.id);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/sessions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum silinemedi" },
      { status: 500 }
    );
  }
}
