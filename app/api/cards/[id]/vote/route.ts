import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";

// POST /api/cards/:id/vote — Oy ver (+1)
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

// DELETE /api/cards/:id/vote — Oyu geri al (-1, minimum 0)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const card = await Card.findById(params.id);
    if (!card) {
      return NextResponse.json(
        { success: false, error: "Kart bulunamadı" },
        { status: 404 }
      );
    }

    if (card.votes <= 0) {
      return NextResponse.json(
        { success: false, error: "Oy sayısı zaten 0" },
        { status: 400 }
      );
    }

    card.votes -= 1;
    await card.save();

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    console.error("DELETE /api/cards/:id/vote error:", error);
    return NextResponse.json(
      { success: false, error: "Oy geri alınamadı" },
      { status: 500 }
    );
  }
}
