import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session, { STATUS_TRANSITIONS } from "@/models/Session";

// POST /api/sessions/:id/status — Durumu bir sonraki aşamaya ilerlet
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

    const nextStatus = STATUS_TRANSITIONS[session.status];

    if (!nextStatus) {
      return NextResponse.json(
        { success: false, error: "Oturum zaten kapalı; daha fazla ilerleme yapılamaz" },
        { status: 400 }
      );
    }

    session.status = nextStatus;
    await session.save();

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("POST /api/sessions/:id/status error:", error);
    return NextResponse.json(
      { success: false, error: "Durum güncellenemedi" },
      { status: 500 }
    );
  }
}
