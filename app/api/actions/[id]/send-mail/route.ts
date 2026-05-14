import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";
import Session from "@/models/Session";
import { sendActionMail } from "@/lib/mailer";

// POST /api/actions/:id/send-mail — Aksiyonu mail ile gönder
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

    if (!action.assigneeEmail) {
      return NextResponse.json(
        { success: false, error: "Aksiyona atanmış bir e-posta adresi yok" },
        { status: 400 }
      );
    }

    const session = await Session.findById(action.sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }

    await sendActionMail({
      to: action.assigneeEmail,
      assigneeName: action.assigneeName || action.assigneeEmail,
      actionDescription: action.description,
      sessionTitle: session.title,
      retroKey: session.retroKey,
      dueDate: action.dueDate,
    });

    // Mail gönderim zamanını kaydet
    action.mailSentAt = new Date();
    await action.save();

    return NextResponse.json({
      success: true,
      data: action,
      message: `Mail ${action.assigneeEmail} adresine gönderildi`,
    });
  } catch (error) {
    console.error("POST /api/actions/:id/send-mail error:", error);
    return NextResponse.json(
      { success: false, error: "Mail gönderilemedi. Gmail ayarlarını kontrol edin." },
      { status: 500 }
    );
  }
}
