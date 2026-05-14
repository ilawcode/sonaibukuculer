import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";

// GET /api/actions?sessionId=xxx
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId zorunludur" },
        { status: 400 }
      );
    }

    const actions = await Action.find({ sessionId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: actions });
  } catch (error) {
    console.error("GET /api/actions error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyonlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/actions — Yeni aksiyon oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, description, assigneeName, assigneeEmail, dueDate } = body;

    if (!sessionId || !description) {
      return NextResponse.json(
        { success: false, error: "sessionId ve description zorunludur" },
        { status: 400 }
      );
    }

    const action = await Action.create({
      sessionId,
      description,
      assigneeName,
      assigneeEmail,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json({ success: true, data: action }, { status: 201 });
  } catch (error) {
    console.error("POST /api/actions error:", error);
    return NextResponse.json(
      { success: false, error: "Aksiyon oluşturulamadı" },
      { status: 500 }
    );
  }
}
