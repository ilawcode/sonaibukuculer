import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";

// GET /api/cards?sessionId=xxx
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const filter = sessionId ? { sessionId } : {};
    const cards = await Card.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error("GET /api/cards error:", error);
    return NextResponse.json(
      { success: false, error: "Kartlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/cards
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, category, content, author } = body;

    if (!sessionId || !category || !content) {
      return NextResponse.json(
        { success: false, error: "sessionId, category ve content zorunludur" },
        { status: 400 }
      );
    }

    const card = await Card.create({ sessionId, category, content, author });
    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cards error:", error);
    return NextResponse.json(
      { success: false, error: "Kart oluşturulamadı" },
      { status: 500 }
    );
  }
}
