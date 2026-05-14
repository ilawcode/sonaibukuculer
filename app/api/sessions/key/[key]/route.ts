import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// GET /api/sessions/key/:key — Retro anahtarıyla oturum bul
export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectDB();
    const session = await Session.findOne({
      retroKey: params.key.toUpperCase().trim(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Retro bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("GET /api/sessions/key/:key error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
