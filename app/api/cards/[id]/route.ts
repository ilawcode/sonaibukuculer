import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";

// GET /api/cards/:id
export async function GET(
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
    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    console.error("GET /api/cards/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Kart alınamadı" },
      { status: 500 }
    );
  }
}

// PATCH /api/cards/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    // content validasyonu
    if (body.content !== undefined) {
      const content = body.content?.trim();
      if (!content || content.length < 1 || content.length > 500) {
        return NextResponse.json(
          { success: false, error: "İçerik 1-500 karakter arasında olmalıdır" },
          { status: 400 }
        );
      }
      body.content = content;
    }

    // votes manuel değiştirilemez
    delete body.votes;

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
