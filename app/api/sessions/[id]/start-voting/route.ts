import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// POST /api/sessions/:id/start-voting — active → voting
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

    if (session.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: `Oylama başlatılamaz. Mevcut durum: ${session.status}. Sadece 'active' durumundaki oturumlar oylamaya alınabilir.`,
        },
        { status: 400 }
      );
    }

    session.status = "voting";
    await session.save();

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("POST /api/sessions/:id/start-voting error:", error);
    return NextResponse.json(
      { success: false, error: "Oylama başlatılamadı" },
      { status: 500 }
    );
  }
}
