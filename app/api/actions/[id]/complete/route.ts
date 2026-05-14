import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";

// POST /api/actions/:id/complete — Aksiyonu tamamla (→ done)
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const action = await Action.findById(params.id);

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Aksiyon bulunamadı" },
        { status: 404 }
      );
    }

    if (action.status === "done") {
      return NextResponse.json(
        { success: false, error: "Aksiyon zaten tamamlanmış" },
        { status: 400 }
      );
    }

    action.status = "done";
    await action.save();

    return NextResponse.json({ success: true, data: action });
  } catch (error) {
    console.error("POST /api/actions/:id/complete error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon tamamlanamadı" },
      { status: 500 }
    );
  }
}
