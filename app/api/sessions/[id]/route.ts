import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import Card from "@/models/Card";
import Action from "@/models/Action";
import Participant from "@/models/Participant";

// GET /api/sessions/:id
export async function GET(
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
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("GET /api/sessions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum alınamadı" },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    // Status değişikliği bu endpoint üzerinden yapılamaz, lifecycle endpoint'leri kullanılmalı
    if (body.status) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Status değişikliği için /advance endpoint'ini kullanın.",
        },
        { status: 400 }
      );
    }

    // title validasyonu
    if (body.title !== undefined) {
      const title = body.title?.trim();
      if (!title || title.length < 3 || title.length > 200) {
        return NextResponse.json(
          { success: false, error: "Başlık 3-200 karakter arasında olmalıdır" },
          { status: 400 }
        );
      }
      body.title = title;
    }

    const session = await Session.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("PATCH /api/sessions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/:id — Cascade delete
export async function DELETE(
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

    // Cascade: ilişkili tüm kayıtları sil
    await Promise.all([
      Card.deleteMany({ sessionId: params.id }),
      Action.deleteMany({ sessionId: params.id }),
      Participant.deleteMany({ sessionId: params.id }),
    ]);

    await session.deleteOne();

    return NextResponse.json({
      success: true,
      data: null,
      message: "Oturum ve ilişkili tüm kayıtlar silindi",
    });
  } catch (error) {
    console.error("DELETE /api/sessions/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Oturum silinemedi" },
      { status: 500 }
    );
  }
}
