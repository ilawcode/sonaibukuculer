"use client";

import { useState } from "react";
import { ISession, SessionStatus, STATUS_TRANSITIONS } from "@/models/Session";
import { ICard, CardCategory } from "@/models/Card";
import CardColumn from "@/components/CardColumn";
import AddCardModal from "@/components/AddCardModal";
import { SESSION_STATUSES } from "@/types";

interface RetroBoardProps {
  session: ISession;
  initialCards: ICard[];
}

const COLUMNS: { category: CardCategory; label: string; icon: string; headerClass: string }[] = [
  {
    category: "went_well",
    label: "İyi Giden",
    icon: "bi-hand-thumbs-up",
    headerClass: "column-header-went-well",
  },
  {
    category: "to_improve",
    label: "Geliştirilecek",
    icon: "bi-arrow-up-circle",
    headerClass: "column-header-to-improve",
  },
  {
    category: "action_item",
    label: "Aksiyon",
    icon: "bi-lightning",
    headerClass: "column-header-action",
  },
  {
    category: "kudos",
    label: "Tebrik",
    icon: "bi-star",
    headerClass: "column-header-kudos",
  },
];

const STATUS_ORDER: SessionStatus[] = [
  "created",
  "waiting_participants",
  "in_progress",
  "review",
  "action_planning",
  "closed",
];

export default function RetroBoard({ session, initialCards }: RetroBoardProps) {
  const [cards, setCards] = useState<ICard[]>(initialCards);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>("went_well");
  const [currentStatus, setCurrentStatus] = useState<SessionStatus>(session.status);
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const [keyCopied, setKeyCopied] = useState(false);

  const sessionId = String(session._id);
  const nextStatus = STATUS_TRANSITIONS[currentStatus];
  const canAddCards = currentStatus === "in_progress";
  const isClosed = currentStatus === "closed";
  const isActionPlanning = currentStatus === "action_planning";

  const handleAddCard = (category: CardCategory) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCardAdded = (newCard: ICard) => {
    setCards((prev) => [newCard, ...prev]);
    setShowModal(false);
  };

  const handleCardDeleted = (cardId: string) => {
    setCards((prev) => prev.filter((c) => String(c._id) !== cardId));
  };

  const handleCardVoted = (updatedCard: ICard) => {
    setCards((prev) =>
      prev.map((c) => (String(c._id) === String(updatedCard._id) ? updatedCard : c))
    );
  };

  const handleAdvanceStatus = async () => {
    setAdvanceLoading(true);
    setAdvanceError("");
    try {
      const res = await fetch(`/api/sessions/${sessionId}/status`, { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        setAdvanceError(data.error || "Durum güncellenemedi");
        return;
      }
      setCurrentStatus(data.data.status as SessionStatus);
    } catch {
      setAdvanceError("Sunucuya bağlanılamadı");
    } finally {
      setAdvanceLoading(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(session.retroKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const currentStepIndex = STATUS_ORDER.indexOf(currentStatus);
  const statusInfo = SESSION_STATUSES[currentStatus];

  return (
    <div>
      {/* Session Header */}
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            {session.title}
          </h2>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {session.teamName && (
              <span className="text-muted small">
                <i className="bi bi-people me-1"></i>
                {session.teamName}
              </span>
            )}
            {session.createdBy && (
              <span className="text-muted small">
                <i className="bi bi-person me-1"></i>
                {session.createdBy}
              </span>
            )}
            <span className="text-muted small">
              <i className="bi bi-card-text me-1"></i>
              {cards.length} kart
            </span>
          </div>
          {session.description && (
            <p className="text-muted small mt-1 mb-0">{session.description}</p>
          )}
        </div>

        {/* Retro Key Badge */}
        {session.retroKey && (
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            style={{
              background: "var(--soft-blue-light)",
              border: "1px solid var(--soft-blue)",
              cursor: "pointer",
            }}
            title="Kopyalamak için tıkla"
            onClick={handleCopyKey}
          >
            <i className="bi bi-key" style={{ color: "var(--soft-blue-dark)" }}></i>
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 2,
                fontSize: "0.9rem",
                color: "var(--text-main)",
              }}
            >
              {session.retroKey}
            </span>
            <i
              className={`bi ${keyCopied ? "bi-clipboard-check text-success" : "bi-clipboard"}`}
              style={{ fontSize: "0.8rem" }}
            ></i>
          </div>
        )}
      </div>

      {/* Status Control Panel */}
      <div
        className="rounded-3 p-3 mb-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
      >
        {/* Stepper */}
        <div className="d-flex align-items-center gap-1 mb-3 flex-wrap">
          {STATUS_ORDER.map((s, i) => {
            const info = SESSION_STATUSES[s];
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={s} className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                  style={{
                    background: isCurrent
                      ? info.color
                      : isDone
                      ? "var(--soft-lila-light)"
                      : "transparent",
                    border: isCurrent
                      ? `1px solid var(--soft-lila)`
                      : "1px solid transparent",
                    opacity: isDone ? 0.6 : 1,
                    fontSize: "0.75rem",
                    fontWeight: isCurrent ? 700 : 400,
                    color: "var(--text-main)",
                  }}
                >
                  <i className={`bi ${isDone ? "bi-check-circle-fill" : info.icon}`} style={{ fontSize: "0.75rem" }}></i>
                  <span className="d-none d-sm-inline">{info.label}</span>
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <i className="bi bi-chevron-right text-muted mx-1" style={{ fontSize: "0.65rem" }}></i>
                )}
              </div>
            );
          })}
        </div>

        {/* Current status + advance button */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <span
              className="badge rounded-pill fw-semibold"
              style={{ background: statusInfo.color, color: "var(--text-main)", fontSize: "0.8rem" }}
            >
              <i className={`bi ${statusInfo.icon} me-1`}></i>
              {statusInfo.label}
            </span>
          </div>

          {advanceError && (
            <span className="text-danger small">
              <i className="bi bi-exclamation-triangle me-1"></i>
              {advanceError}
            </span>
          )}

          {nextStatus && !isClosed && (
            <button
              className="btn btn-sm btn-soft-primary"
              onClick={handleAdvanceStatus}
              disabled={advanceLoading}
            >
              {advanceLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-arrow-right-circle me-1"></i>
              )}
              {SESSION_STATUSES[nextStatus].label} Aşamasına Geç
            </button>
          )}

          {isClosed && (
            <span className="text-muted small">
              <i className="bi bi-lock me-1"></i>
              Oturum kapatıldı
            </span>
          )}
        </div>
      </div>

      {/* Waiting state message */}
      {(currentStatus === "created" || currentStatus === "waiting_participants") && (
        <div
          className="rounded-3 p-4 mb-4 text-center"
          style={{ background: "var(--soft-lila-light)", border: "1px solid var(--soft-lila)" }}
        >
          <i className="bi bi-hourglass-split fs-2 mb-2 d-block" style={{ color: "var(--soft-lila-dark)" }}></i>
          <h5 className="fw-semibold mb-1" style={{ color: "var(--text-main)" }}>
            {currentStatus === "created" ? "Retro henüz başlamadı" : "Katılımcılar bekleniyor"}
          </h5>
          <p className="text-muted small mb-0">
            Katılım kodu: <strong style={{ fontFamily: "monospace", letterSpacing: 2 }}>{session.retroKey}</strong>
            {" "}— Hazır olduğunuzda yukarıdaki butonla sonraki aşamaya geçin.
          </p>
        </div>
      )}

      {/* Board Columns — visible from in_progress onward */}
      {(currentStatus === "in_progress" || currentStatus === "review" || currentStatus === "action_planning" || currentStatus === "closed") && (
        <div className="row g-3 mb-4">
          {COLUMNS.map((col) => (
            <div key={col.category} className="col-md-6 col-xl-3">
              <CardColumn
                category={col.category}
                label={col.label}
                icon={col.icon}
                headerClass={col.headerClass}
                cards={cards.filter((c) => c.category === col.category)}
                sessionStatus={canAddCards ? "active" : "closed"}
                onAddCard={() => handleAddCard(col.category)}
                onCardDeleted={handleCardDeleted}
                onCardVoted={handleCardVoted}
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Planning Panel */}
      {isActionPlanning && (
        <ActionPlanningPanel sessionId={sessionId} />
      )}

      {/* Add Card Modal */}
      {showModal && (
        <AddCardModal
          sessionId={sessionId}
          defaultCategory={selectedCategory}
          onClose={() => setShowModal(false)}
          onCardAdded={handleCardAdded}
        />
      )}
    </div>
  );
}

/* ── Inline Action Planning Panel ─────────────────────── */
interface IAction {
  _id: string;
  description: string;
  assigneeName?: string;
  dueDate?: string;
  status: string;
}

function ActionPlanningPanel({ sessionId }: { sessionId: string }) {
  const [actions, setActions] = useState<IAction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: "", assigneeName: "", dueDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadActions = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/actions?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success) setActions(data.data);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  // Auto-load on mount
  useState(() => { loadActions(); });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          description: form.description.trim(),
          assigneeName: form.assigneeName.trim() || undefined,
          dueDate: form.dueDate || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Hata"); return; }
      setActions((prev) => [data.data, ...prev]);
      setForm({ description: "", assigneeName: "", dueDate: "" });
    } catch {
      setError("Sunucuya bağlanılamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="rounded-3 p-4 mb-4"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <h5 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>
        <i className="bi bi-list-task me-2"></i>
        Aksiyon Planlama
      </h5>

      <form onSubmit={handleAdd} className="row g-2 mb-4">
        <div className="col-12 col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Aksiyon açıklaması *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="col-6 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Sorumlu kişi"
            value={form.assigneeName}
            onChange={(e) => setForm({ ...form, assigneeName: e.target.value })}
          />
        </div>
        <div className="col-6 col-md-2">
          <input
            type="date"
            className="form-control"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
        <div className="col-12 col-md-2">
          <button type="submit" className="btn btn-soft-primary w-100" disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <><i className="bi bi-plus me-1"></i>Ekle</>}
          </button>
        </div>
        {error && <div className="col-12"><p className="text-danger small mb-0">{error}</p></div>}
      </form>

      {loading && <div className="text-center py-3"><span className="spinner-border spinner-border-sm text-muted"></span></div>}

      {!loading && actions.length === 0 && (
        <p className="text-muted small text-center py-2">Henüz aksiyon eklenmedi.</p>
      )}

      {actions.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {actions.map((a) => (
            <div
              key={a._id}
              className="d-flex align-items-start gap-3 p-3 rounded-3"
              style={{ background: "var(--bg-main)", border: "1px solid var(--border-color)" }}
            >
              <i className="bi bi-lightning-charge mt-1" style={{ color: "var(--soft-lila-dark)" }}></i>
              <div className="flex-grow-1">
                <p className="mb-0 fw-semibold small" style={{ color: "var(--text-main)" }}>{a.description}</p>
                <div className="d-flex gap-3 mt-1 flex-wrap">
                  {a.assigneeName && (
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      <i className="bi bi-person me-1"></i>{a.assigneeName}
                    </span>
                  )}
                  {a.dueDate && (
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(a.dueDate).toLocaleDateString("tr-TR")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


interface RetroBoardProps {
  session: ISession;
  initialCards: ICard[];
}

const COLUMNS: { category: CardCategory; label: string; icon: string; headerClass: string }[] = [
  {
    category: "went_well",
    label: "İyi Giden",
    icon: "bi-hand-thumbs-up",
    headerClass: "column-header-went-well",
  },
  {
    category: "to_improve",
    label: "Geliştirilecek",
    icon: "bi-arrow-up-circle",
    headerClass: "column-header-to-improve",
  },
  {
    category: "action_item",
    label: "Aksiyon",
    icon: "bi-lightning",
    headerClass: "column-header-action",
  },
  {
    category: "kudos",
    label: "Tebrik",
    icon: "bi-star",
    headerClass: "column-header-kudos",
  },
];

export default function RetroBoard({ session, initialCards }: RetroBoardProps) {
  const [cards, setCards] = useState<ICard[]>(initialCards);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>("went_well");

  const handleAddCard = (category: CardCategory) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCardAdded = (newCard: ICard) => {
    setCards((prev) => [newCard, ...prev]);
    setShowModal(false);
  };

  const handleCardDeleted = (cardId: string) => {
    setCards((prev) => prev.filter((c) => String(c._id) !== cardId));
  };

  const handleCardVoted = (updatedCard: ICard) => {
    setCards((prev) =>
      prev.map((c) => (String(c._id) === String(updatedCard._id) ? updatedCard : c))
    );
  };

  const sessionId = String(session._id);

  return (
    <div>
      {/* Session Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            {session.title}
          </h2>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {session.teamName && (
              <span className="text-muted small">
                <i className="bi bi-people me-1"></i>
                {session.teamName}
              </span>
            )}
            {session.createdBy && (
              <span className="text-muted small">
                <i className="bi bi-person me-1"></i>
                {session.createdBy}
              </span>
            )}
            <span
              className={
                session.status === "active"
                  ? "status-badge-active"
                  : "status-badge-closed"
              }
            >
              {session.status === "active" ? "Aktif" : "Kapalı"}
            </span>
            <span className="text-muted small">
              <i className="bi bi-card-text me-1"></i>
              {cards.length} kart
            </span>
          </div>
          {session.description && (
            <p className="text-muted small mt-1 mb-0">{session.description}</p>
          )}
        </div>

        {/* Retro Key Badge */}
        {session.retroKey && (
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            style={{
              background: "var(--soft-blue-light)",
              border: "1px solid var(--soft-blue)",
              cursor: "pointer",
            }}
            title="Arkadaşlarınızla paylaşın"
            onClick={() => {
              navigator.clipboard?.writeText(session.retroKey);
            }}
          >
            <i className="bi bi-key" style={{ color: "var(--soft-blue-dark)" }}></i>
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: 2,
                fontSize: "0.9rem",
                color: "var(--text-main)",
              }}
            >
              {session.retroKey}
            </span>
            <i className="bi bi-clipboard" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}></i>
          </div>
        )}
      </div>

      {/* Board Columns */}
      <div className="row g-3">
        {COLUMNS.map((col) => (
          <div key={col.category} className="col-md-6 col-xl-3">
            <CardColumn
              category={col.category}
              label={col.label}
              icon={col.icon}
              headerClass={col.headerClass}
              cards={cards.filter((c) => c.category === col.category)}
              sessionStatus={session.status}
              onAddCard={() => handleAddCard(col.category)}
              onCardDeleted={handleCardDeleted}
              onCardVoted={handleCardVoted}
            />
          </div>
        ))}
      </div>

      {/* Add Card Modal */}
      {showModal && (
        <AddCardModal
          sessionId={sessionId}
          defaultCategory={selectedCategory}
          onClose={() => setShowModal(false)}
          onCardAdded={handleCardAdded}
        />
      )}
    </div>
  );
}
