import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// GET /api/sessions?status=active
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const sessions = await Session.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Oturumlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/sessions — Yeni oturum oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, teamName, createdBy } = body;

    // title validasyonu
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Başlık zorunludur" },
        { status: 400 }
      );
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3 || trimmedTitle.length > 200) {
      return NextResponse.json(
        { success: false, error: "Başlık 3-200 karakter arasında olmalıdır" },
        { status: 400 }
      );
    }

    // description max length
    if (description && description.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: "Açıklama en fazla 1000 karakter olabilir" },
        { status: 400 }
      );
    }

    const session = await Session.create({
      title: trimmedTitle,
      description: description?.trim(),
      teamName: teamName?.trim(),
      createdBy: createdBy?.trim(),
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum oluşturulamadı" },
      { status: 500 }
    );
  }
}
