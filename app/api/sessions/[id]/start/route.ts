import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// POST /api/sessions/:id/start — waiting → active
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await Session.findById(params.id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }

    if (session.status !== "waiting") {
      return NextResponse.json(
        {
          success: false,
          error: `Oturum başlatılamaz. Mevcut durum: ${session.status}. Sadece 'waiting' durumundaki oturumlar başlatılabilir.`,
        },
        { status: 400 }
      );
    }

    session.status = "active";
    await session.save();

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("POST /api/sessions/:id/start error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum başlatılamadı" },
      { status: 500 }
    );
  }
}
