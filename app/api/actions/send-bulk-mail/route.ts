import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Action from "@/models/Action";
import Session from "@/models/Session";
import { sendActionMail } from "@/lib/mailer";

// POST /api/actions/send-bulk-mail
// Body: { sessionId, actionIds?: string[] }
// actionIds yoksa sessionId'ye ait tüm açık (open/in_progress) ve email'i olan aksiyonlar gönderilir
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, actionIds } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId zorunludur" },
        { status: 400 }
      );
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 404 }
      );
    }

    // Gönderilecek aksiyonları belirle
    const filter: Record<string, unknown> = {
      sessionId,
      assigneeEmail: { $exists: true, $ne: null, $ne: "" },
    };

    if (actionIds && Array.isArray(actionIds) && actionIds.length > 0) {
      filter._id = { $in: actionIds };
    } else {
      // Sadece açık ve devam eden aksiyonları gönder
      filter.status = { $in: ["open", "in_progress"] };
    }

    const actions = await Action.find(filter);

    if (actions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Gönderilecek aksiyon bulunamadı" },
        { status: 404 }
      );
    }

    const results: { actionId: string; email: string; status: "sent" | "failed"; error?: string }[] = [];

    // Her aksiyonu sırayla gönder
    for (const action of actions) {
      try {
        await sendActionMail({
          to: action.assigneeEmail!,
          assigneeName: action.assigneeName || action.assigneeEmail!,
          actionDescription: action.description,
          sessionTitle: session.title,
          retroKey: session.retroKey,
          dueDate: action.dueDate,
        });

        action.mailSentAt = new Date();
        await action.save();

        results.push({
          actionId: String(action._id),
          email: action.assigneeEmail!,
          status: "sent",
        });
      } catch (err) {
        results.push({
          actionId: String(action._id),
          email: action.assigneeEmail!,
          status: "failed",
          error: err instanceof Error ? err.message : "Bilinmeyen hata",
        });
      }
    }

    const sentCount = results.filter((r) => r.status === "sent").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({
      success: failedCount === 0,
      data: { sent: sentCount, failed: failedCount, results },
      message: `${sentCount} mail gönderildi${failedCount > 0 ? `, ${failedCount} başarısız` : ""}`,
    });
  } catch (error) {
    console.error("POST /api/actions/send-bulk-mail error:", error);
    return NextResponse.json(
      { success: false, error: "Toplu mail gönderilemedi" },
      { status: 500 }
    );
  }
}
