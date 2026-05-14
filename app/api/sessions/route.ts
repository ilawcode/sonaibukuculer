import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// GET /api/sessions - Tüm oturumları listele
export async function GET() {
  try {
    await connectDB();
    const sessions = await Session.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Oturumlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Yeni oturum oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, teamName } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Başlık zorunludur" },
        { status: 400 }
      );
    }

    const session = await Session.create({ title, description, teamName });
    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum oluşturulamadı" },
      { status: 500 }
    );
  }
}
