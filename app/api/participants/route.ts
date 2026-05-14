import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Participant from "@/models/Participant";

// GET /api/participants?sessionId=xxx
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

    const participants = await Participant.find({ sessionId }).sort({
      joinedAt: 1,
    });
    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error("GET /api/participants error:", error);
    return NextResponse.json(
      { success: false, error: "Katılımcılar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/participants — Retroya katıl
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, name, email } = body;

    if (!sessionId || !name) {
      return NextResponse.json(
        { success: false, error: "sessionId ve name zorunludur" },
        { status: 400 }
      );
    }

    // Email varsa upsert, yoksa her seferinde yeni kayıt
    let participant;
    if (email) {
      participant = await Participant.findOneAndUpdate(
        { sessionId, email: email.toLowerCase().trim() },
        { name: name.trim(), joinedAt: new Date() },
        { upsert: true, new: true, runValidators: true }
      );
    } else {
      participant = await Participant.create({
        sessionId,
        name: name.trim(),
        joinedAt: new Date(),
      });
    }

    return NextResponse.json(
      { success: true, data: participant },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/participants error:", error);
    return NextResponse.json(
      { success: false, error: "Katılım kaydedilemedi" },
      { status: 500 }
    );
  }
}
