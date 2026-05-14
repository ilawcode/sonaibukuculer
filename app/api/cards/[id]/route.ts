import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";

// PATCH /api/cards/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const card = await Card.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      return NextResponse.json(
        { success: false, error: "Kart bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    console.error("PATCH /api/cards/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Kart güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const card = await Card.findByIdAndDelete(params.id);
    if (!card) {
      return NextResponse.json(
        { success: false, error: "Kart bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/cards/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Kart silinemedi" },
      { status: 500 }
    );
  }
}

// POST /api/cards/:id/vote
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const card = await Card.findByIdAndUpdate(
      params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    if (!card) {
      return NextResponse.json(
        { success: false, error: "Kart bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    console.error("POST /api/cards/:id/vote error:", error);
    return NextResponse.json(
      { success: false, error: "Oy verilemedi" },
      { status: 500 }
    );
  }
}
