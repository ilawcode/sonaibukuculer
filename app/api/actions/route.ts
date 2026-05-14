import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";
import Session from "@/models/Session";

// GET /api/actions?sessionId=xxx&status=open
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const status = searchParams.get("status");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId zorunludur" },
        { status: 400 }
      );
    }

    const filter: Record<string, unknown> = { sessionId };
    if (status) filter.status = status;

    const actions = await Action.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: actions });
  } catch (error) {
    console.error("GET /api/actions error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyonlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/actions — Yeni aksiyon oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, description, assigneeName, assigneeEmail, dueDate } = body;

    if (!sessionId || !description) {
      return NextResponse.json(
        { success: false, error: "sessionId ve description zorunludur" },
        { status: 400 }
      );
    }

    // description validasyonu
    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 5 || trimmedDesc.length > 500) {
      return NextResponse.json(
        { success: false, error: "Açıklama 5-500 karakter arasında olmalıdır" },
        { status: 400 }
      );
    }

    // assigneeEmail varsa assigneeName de olmalı
    if (assigneeEmail && !assigneeName) {
      return NextResponse.json(
        { success: false, error: "E-posta girildiğinde isim de zorunludur" },
        { status: 400 }
      );
    }

    // dueDate geçmiş olamaz
    if (dueDate) {
      const due = new Date(dueDate);
      if (isNaN(due.getTime())) {
        return NextResponse.json(
          { success: false, error: "Geçersiz tarih formatı" },
          { status: 400 }
        );
      }
      if (due < new Date()) {
        return NextResponse.json(
          { success: false, error: "Son tarih geçmiş bir tarih olamaz" },
          { status: 400 }
        );
      }
    }

    // Session var mı?
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }
    if (session.status === "closed") {
      return NextResponse.json(
        { success: false, error: "Kapalı oturumlara aksiyon eklenemez" },
        { status: 400 }
      );
    }

    const action = await Action.create({
      sessionId,
      description: trimmedDesc,
      assigneeName: assigneeName?.trim(),
      assigneeEmail: assigneeEmail?.toLowerCase().trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json({ success: true, data: action }, { status: 201 });
  } catch (error) {
    console.error("POST /api/actions error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon oluşturulamadı" },
      { status: 500 }
    );
  }
}
