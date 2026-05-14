"use client";

import { useState } from "react";
import { ISession } from "@/models/Session";
import { ICard } from "@/models/Card";
import { CardType, SESSION_STATUSES, SessionStatus } from "@/types";
import CardColumn from "@/components/CardColumn";
import AddCardModal from "@/components/AddCardModal";

interface RetroBoardProps {
  session: ISession;
  initialCards: ICard[];
}

const COLUMNS: { type: CardType; label: string; icon: string; headerClass: string }[] = [
  { type: "positive",  label: "İyi Giden",      icon: "bi-hand-thumbs-up",  headerClass: "column-header-went-well"    },
  { type: "negative",  label: "Geliştirilecek",  icon: "bi-arrow-up-circle", headerClass: "column-header-to-improve"   },
  { type: "kudos",     label: "Tebrik",          icon: "bi-star",            headerClass: "column-header-kudos"        },
];

const STATUS_NEXT: Partial<Record<SessionStatus, { label: string }>> = {
  created:              { label: "Katılıma Aç"       },
  waiting_participants: { label: "Kartları Topla"    },
  in_progress:          { label: "İncelemeye Geç"   },
  review:               { label: "Aksiyon Planla"   },
  action_planning:      { label: "Oturumu Kapat"    },
};

export default function RetroBoard({ session, initialCards }: RetroBoardProps) {
  const [cards, setCards]               = useState<ICard[]>(initialCards);
  const [showModal, setShowModal]       = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>("positive");
  const [status, setStatus]             = useState<SessionStatus>(session.status as SessionStatus);
  const [advancing, setAdvancing]       = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const [keyCopied, setKeyCopied]       = useState(false);

  const sessionId  = String(session._id);
  const canEdit    = status === "in_progress";
  const isClosed   = status === "closed";
  const nextAction = STATUS_NEXT[status];
  const statusInfo = SESSION_STATUSES[status] ?? { label: status, icon: "bi-circle", color: "#e8e8f0" };

  /* ── Handlers ─────────────────────────────────────── */
  const handleAddCard = (type: CardType) => { setSelectedType(type); setShowModal(true); };
  const handleCardAdded   = (c: ICard)   => { setCards(p => [c, ...p]); setShowModal(false); };
  const handleCardDeleted = (id: string) => { setCards(p => p.filter(c => String(c._id) !== id)); };
  const handleCardVoted   = (c: ICard)   => { setCards(p => p.map(x => String(x._id) === String(c._id) ? c : x)); };

  const handleAdvance = async () => {
    if (!nextAction) return;
    setAdvancing(true);
    setAdvanceError("");
    try {
      const res  = await fetch(`/api/sessions/${sessionId}/advance`, { method: "POST" });
      const data = await res.json();
      if (!data.success) { setAdvanceError(data.error || "Hata"); return; }
      setStatus(data.data.status as SessionStatus);
    } catch { setAdvanceError("Sunucuya bağlanılamadı"); }
    finally  { setAdvancing(false); }
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(session.retroKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  /* ── Render ───────────────────────────────────────── */
  return (
    <div>
      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>{session.title}</h2>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {session.teamName  && <span className="text-muted small"><i className="bi bi-people me-1"></i>{session.teamName}</span>}
            {session.createdBy && <span className="text-muted small"><i className="bi bi-person me-1"></i>{session.createdBy}</span>}
            <span className="text-muted small"><i className="bi bi-card-text me-1"></i>{cards.length} kart</span>
          </div>
          {session.description && <p className="text-muted small mt-1 mb-0">{session.description}</p>}
        </div>

        {/* Retro Key */}
        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          style={{ background: "var(--soft-blue-light)", border: "1px solid var(--soft-blue)", cursor: "pointer" }}
          onClick={handleCopyKey}
          title="Kopyalamak için tıkla"
        >
          <i className="bi bi-key" style={{ color: "var(--soft-blue-dark)" }}></i>
          <span style={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: 2, fontSize: "0.9rem", color: "var(--text-main)" }}>
            {session.retroKey}
          </span>
          <i className={`bi ${keyCopied ? "bi-clipboard-check text-success" : "bi-clipboard"}`} style={{ fontSize: "0.8rem" }}></i>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className="rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
        <span className="badge rounded-pill fw-semibold"
          style={{ background: statusInfo.color, color: "var(--text-main)", fontSize: "0.82rem" }}>
          <i className={`bi ${statusInfo.icon} me-1`}></i>{statusInfo.label}
        </span>

        <div className="d-flex align-items-center gap-2">
          {advanceError && <span className="text-danger small"><i className="bi bi-exclamation-triangle me-1"></i>{advanceError}</span>}
          {nextAction && !isClosed && (
            <button className="btn btn-sm btn-soft-primary" onClick={handleAdvance} disabled={advancing}>
              {advancing
                ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                : <i className="bi bi-arrow-right-circle me-1"></i>}
              {nextAction.label}
            </button>
          )}
          {isClosed && <span className="text-muted small"><i className="bi bi-lock me-1"></i>Oturum kapatıldı</span>}
        </div>
      </div>

      {/* ── Board Columns ── */}
      <div className="row g-3 mb-4">
        {COLUMNS.map(col => (
          <div key={col.type} className="col-md-4">
            <CardColumn
              type={col.type}
              label={col.label}
              icon={col.icon}
              headerClass={col.headerClass}
              cards={cards.filter(c => c.type === col.type)}
              canEdit={canEdit}
              onAddCard={() => handleAddCard(col.type)}
              onCardDeleted={handleCardDeleted}
              onCardVoted={handleCardVoted}
            />
          </div>
        ))}
      </div>

      {/* ── Action Planning (action_planning & closed) ── */}
      {(status === "action_planning" || status === "closed") && (
        <ActionPanel sessionId={sessionId} readOnly={isClosed} />
      )}

      {/* ── Add Card Modal ── */}
      {showModal && (
        <AddCardModal
          sessionId={sessionId}
          defaultType={selectedType}
          onClose={() => setShowModal(false)}
          onCardAdded={handleCardAdded}
        />
      )}
    </div>
  );
}

/* ── Action Panel ─────────────────────────────────────── */
interface ActionItem {
  _id: string;
  description: string;
  assigneeName?: string;
  assigneeEmail?: string;
  dueDate?: string;
  status: string;
  mailSentAt?: string;
}

function ActionPanel({ sessionId, readOnly }: { sessionId: string; readOnly: boolean }) {
  const [actions, setActions]   = useState<ActionItem[]>([]);
  const [loaded, setLoaded]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [mailing, setMailing]   = useState<string | null>(null);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({ description: "", assigneeName: "", assigneeEmail: "", dueDate: "" });

  // Load on first render
  useState(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/actions?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.success) setActions(data.data);
      } finally { setLoading(false); setLoaded(true); }
    })();
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSaving(true); setError("");
    try {
      const res  = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          description:   form.description.trim(),
          assigneeName:  form.assigneeName.trim()  || undefined,
          assigneeEmail: form.assigneeEmail.trim() || undefined,
          dueDate:       form.dueDate              || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Hata"); return; }
      setActions(p => [data.data, ...p]);
      setForm({ description: "", assigneeName: "", assigneeEmail: "", dueDate: "" });
    } catch { setError("Sunucuya bağlanılamadı"); }
    finally  { setSaving(false); }
  };

  const handleSendMail = async (actionId: string) => {
    setMailing(actionId);
    try {
      const res  = await fetch(`/api/actions/${actionId}/send-mail`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActions(p => p.map(a => String(a._id) === actionId ? data.data : a));
      } else {
        alert(data.error || "Mail gönderilemedi");
      }
    } catch { alert("Sunucuya bağlanılamadı"); }
    finally  { setMailing(null); }
  };

  const handleComplete = async (actionId: string) => {
    try {
      const res  = await fetch(`/api/actions/${actionId}/complete`, { method: "POST" });
      const data = await res.json();
      if (data.success) setActions(p => p.map(a => String(a._id) === actionId ? data.data : a));
    } catch { /* silent */ }
  };

  const STATUS_COLORS: Record<string, string> = {
    open:        "var(--soft-blue-light)",
    in_progress: "var(--soft-peach-light)",
    done:        "var(--soft-mint-light)",
  };
  const STATUS_LABELS: Record<string, string> = {
    open: "Açık", in_progress: "Devam Ediyor", done: "Tamamlandı",
  };

  return (
    <div className="rounded-3 p-4 mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
      <h5 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>
        <i className="bi bi-list-task me-2"></i>Aksiyon Planı
      </h5>

      {!readOnly && (
        <form onSubmit={handleAdd} className="row g-2 mb-4">
          <div className="col-12 col-md-4">
            <input type="text" className="form-control" placeholder="Aksiyon açıklaması *"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="col-6 col-md-2">
            <input type="text" className="form-control" placeholder="Sorumlu adı"
              value={form.assigneeName} onChange={e => setForm({ ...form, assigneeName: e.target.value })} />
          </div>
          <div className="col-6 col-md-3">
            <input type="email" className="form-control" placeholder="Sorumlu e-posta"
              value={form.assigneeEmail} onChange={e => setForm({ ...form, assigneeEmail: e.target.value })} />
          </div>
          <div className="col-6 col-md-2">
            <input type="date" className="form-control"
              value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="col-6 col-md-1">
            <button type="submit" className="btn btn-soft-primary w-100" disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="bi bi-plus"></i>}
            </button>
          </div>
          {error && <div className="col-12"><p className="text-danger small mb-0">{error}</p></div>}
        </form>
      )}

      {loading && !loaded && <div className="text-center py-3"><span className="spinner-border spinner-border-sm text-muted"></span></div>}

      {loaded && actions.length === 0 && (
        <p className="text-muted small text-center py-2 mb-0">Henüz aksiyon eklenmedi.</p>
      )}

      {actions.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {actions.map(a => (
            <div key={a._id} className="d-flex align-items-start gap-3 p-3 rounded-3"
              style={{ background: STATUS_COLORS[a.status] ?? "var(--bg-main)", border: "1px solid var(--border-color)" }}>
              <i className="bi bi-lightning-charge mt-1" style={{ color: "var(--soft-lila-dark)", flexShrink: 0 }}></i>
              <div className="flex-grow-1 min-width-0">
                <p className="mb-1 fw-semibold small" style={{ color: "var(--text-main)" }}>{a.description}</p>
                <div className="d-flex gap-3 flex-wrap align-items-center">
                  {a.assigneeName  && <span className="text-muted" style={{ fontSize: "0.75rem" }}><i className="bi bi-person me-1"></i>{a.assigneeName}</span>}
                  {a.assigneeEmail && <span className="text-muted" style={{ fontSize: "0.75rem" }}><i className="bi bi-envelope me-1"></i>{a.assigneeEmail}</span>}
                  {a.dueDate       && <span className="text-muted" style={{ fontSize: "0.75rem" }}><i className="bi bi-calendar3 me-1"></i>{new Date(a.dueDate).toLocaleDateString("tr-TR")}</span>}
                  <span className="badge rounded-pill" style={{ background: "rgba(0,0,0,0.08)", color: "var(--text-main)", fontSize: "0.7rem" }}>
                    {STATUS_LABELS[a.status] ?? a.status}
                  </span>
                  {a.mailSentAt && <span className="text-muted" style={{ fontSize: "0.7rem" }}><i className="bi bi-check2-circle me-1 text-success"></i>Mail gönderildi</span>}
                </div>
              </div>

              {!readOnly && (
                <div className="d-flex gap-1 flex-shrink-0">
                  {/* Mail gönder */}
                  {a.assigneeEmail && a.status !== "done" && (
                    <button className="vote-btn" title="Mail gönder" disabled={mailing === a._id}
                      onClick={() => handleSendMail(a._id)}>
                      {mailing === a._id
                        ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }}></span>
                        : <i className="bi bi-envelope" style={{ fontSize: "0.75rem" }}></i>}
                    </button>
                  )}
                  {/* Tamamla */}
                  {a.status !== "done" && (
                    <button className="vote-btn" title="Tamamlandı olarak işaretle"
                      onClick={() => handleComplete(a._id)}>
                      <i className="bi bi-check2" style={{ fontSize: "0.75rem", color: "#2a6a4a" }}></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
