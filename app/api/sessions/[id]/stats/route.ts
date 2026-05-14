import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import Card from "@/models/Card";
import Action from "@/models/Action";
import Participant from "@/models/Participant";

// GET /api/sessions/:id/stats — Oturum istatistikleri
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

    const [cards, actions, participants] = await Promise.all([
      Card.find({ sessionId: params.id }),
      Action.find({ sessionId: params.id }),
      Participant.find({ sessionId: params.id }),
    ]);

    const stats = {
      session: {
        _id: session._id,
        title: session.title,
        status: session.status,
        retroKey: session.retroKey,
      },
      participants: {
        total: participants.length,
      },
      cards: {
        total: cards.length,
        positive: cards.filter((c) => c.type === "positive").length,
        negative: cards.filter((c) => c.type === "negative").length,
        kudos: cards.filter((c) => c.type === "kudos").length,
        totalVotes: cards.reduce((sum, c) => sum + c.votes, 0),
        topCard: cards.sort((a, b) => b.votes - a.votes)[0] || null,
      },
      actions: {
        total: actions.length,
        open: actions.filter((a) => a.status === "open").length,
        in_progress: actions.filter((a) => a.status === "in_progress").length,
        done: actions.filter((a) => a.status === "done").length,
        withEmail: actions.filter((a) => a.assigneeEmail).length,
        mailSent: actions.filter((a) => a.mailSentAt).length,
      },
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/sessions/:id/stats error:", error);
    return NextResponse.json(
      { success: false, error: "İstatistikler alınamadı" },
      { status: 500 }
    );
  }
}
