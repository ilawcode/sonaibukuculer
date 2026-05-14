import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import Session from "@/models/Session";

const VALID_TYPES = ["positive", "negative", "kudos"];

// GET /api/cards?sessionId=xxx&type=positive
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const type = searchParams.get("type");

    const filter: Record<string, string> = {};
    if (sessionId) filter.sessionId = sessionId;
    if (type) {
      if (!VALID_TYPES.includes(type)) {
        return NextResponse.json(
          { success: false, error: `Geçersiz tip. Geçerli tipler: ${VALID_TYPES.join(", ")}` },
          { status: 400 }
        );
      }
      filter.type = type;
    }

    const cards = await Card.find(filter).sort({ votes: -1, createdAt: -1 });
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

    // Zorunlu alan kontrolü
    if (!sessionId || !type || !content) {
      return NextResponse.json(
        { success: false, error: "sessionId, type ve content zorunludur" },
        { status: 400 }
      );
    }

    // Type validasyonu
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Geçersiz tip. Geçerli tipler: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Content uzunluk validasyonu
    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 500) {
      return NextResponse.json(
        { success: false, error: "İçerik 1-500 karakter arasında olmalıdır" },
        { status: 400 }
      );
    }

    // Session var mı ve aktif mi?
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }
    if (session.status === "closed") {
      return NextResponse.json(
        { success: false, error: "Kapalı oturumlara kart eklenemez" },
        { status: 400 }
      );
    }

    if (session.status !== "in_progress") {
      return NextResponse.json(
        { success: false, error: "Kart sadece 'Devam Ediyor' aşamasında eklenebilir" },
        { status: 400 }
      );
    }

    const card = await Card.create({
      sessionId,
      type,
      content: trimmedContent,
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
