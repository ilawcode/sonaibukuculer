import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";

const VALID_STATUSES = ["open", "in_progress", "done"];
const STATUS_TRANSITIONS: Record<string, string[]> = {
  open: ["in_progress"],
  in_progress: ["done"],
  done: [],
};

// GET /api/actions/:id
export async function GET(
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
    return NextResponse.json({ success: true, data: action });
  } catch (error) {
    console.error("GET /api/actions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon alınamadı" },
      { status: 500 }
    );
  }
}

// PATCH /api/actions/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    // Status geçiş validasyonu
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: `Geçersiz durum. Geçerli durumlar: ${VALID_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }

      const action = await Action.findById(params.id);
      if (!action) {
        return NextResponse.json(
          { success: false, error: "Aksiyon bulunamadı" },
          { status: 404 }
        );
      }

      const allowed = STATUS_TRANSITIONS[action.status];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Geçersiz durum geçişi: ${action.status} → ${body.status}. İzin verilen: ${allowed.join(", ") || "yok"}`,
          },
          { status: 400 }
        );
      }
    }

    // description validasyonu
    if (body.description !== undefined) {
      const desc = body.description?.trim();
      if (!desc || desc.length < 5 || desc.length > 500) {
        return NextResponse.json(
          { success: false, error: "Açıklama 5-500 karakter arasında olmalıdır" },
          { status: 400 }
        );
      }
      body.description = desc;
    }

    // mailSentAt manuel değiştirilemez
    delete body.mailSentAt;

    const action = await Action.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Aksiyon bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: action });
  } catch (error) {
    console.error("PATCH /api/actions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/actions/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const action = await Action.findByIdAndDelete(params.id);

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Aksiyon bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/actions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon silinemedi" },
      { status: 500 }
    );
  }
}
