import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Participant from "@/models/Participant";

// GET /api/participants/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const participant = await Participant.findById(params.id);
    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Katılımcı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: participant });
  } catch (error) {
    console.error("GET /api/participants/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Katılımcı alınamadı" },
      { status: 500 }
    );
  }
}

// PATCH /api/participants/:id — Ad veya email güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    // Sadece name ve email güncellenebilir
    const allowedFields: Record<string, unknown> = {};
    if (body.name !== undefined) {
      const name = body.name?.trim();
      if (!name || name.length < 2 || name.length > 100) {
        return NextResponse.json(
          { success: false, error: "Ad 2-100 karakter arasında olmalıdır" },
          { status: 400 }
        );
      }
      allowedFields.name = name;
    }
    if (body.email !== undefined) {
      allowedFields.email = body.email?.toLowerCase().trim();
    }

    const participant = await Participant.findByIdAndUpdate(
      params.id,
      allowedFields,
      { new: true, runValidators: true }
    );

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Katılımcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: participant });
  } catch (error) {
    console.error("PATCH /api/participants/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Katılımcı güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/participants/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const participant = await Participant.findByIdAndDelete(params.id);
    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Katılımcı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/participants/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Katılımcı silinemedi" },
      { status: 500 }
    );
  }
}
