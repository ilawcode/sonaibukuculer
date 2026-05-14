import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

// POST /api/sessions/:id/close — voting → closed
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

    if (session.status !== "voting") {
      return NextResponse.json(
        {
          success: false,
          error: `Oturum kapatılamaz. Mevcut durum: ${session.status}. Sadece 'voting' durumundaki oturumlar kapatılabilir.`,
        },
        { status: 400 }
      );
    }

    session.status = "closed";
    await session.save();

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("POST /api/sessions/:id/close error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum kapatılamadı" },
      { status: 500 }
    );
  }
}
