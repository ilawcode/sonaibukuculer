import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";

// GET /api/cards?sessionId=xxx&type=positive
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const type = searchParams.get("type");

    const filter: Record<string, string> = {};
    if (sessionId) filter.sessionId = sessionId;
    if (type) filter.type = type;

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

// POST /api/cards — Anonim kart ekle
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, type, content, participantId } = body;

    if (!sessionId || !type || !content) {
      return NextResponse.json(
        { success: false, error: "sessionId, type ve content zorunludur" },
        { status: 400 }
      );
    }

    // Anonim: author kaydedilmez
    const card = await Card.create({
      sessionId,
      type,
      content,
      participantId: participantId || null,
    });

    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cards error:", error);
    return NextResponse.json(
      { success: false, error: "Kart oluşturulamadı" },
      { status: 500 }
    );
  }
}
