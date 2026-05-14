"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReminderModal from "@/components/ReminderModal";
import { RetroActionItem, RetroActionPriority, RetroActionStatus, RetroDetail, RetroParticipant } from "@/types";

interface RetroHistoryDetailProps {
  retro: RetroDetail;
}

type ToastState = {
  actionId: string;
  message: string;
} | null;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) return "Henuz gonderilmedi";

  return new Date(date).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAttendanceLabel(status: RetroParticipant["attendanceStatus"]) {
  if (status === "attended") return "Katilim saglandi";
  if (status === "late") return "Gec katildi";
  return "Katilmadi";
}

function getPriorityLabel(priority: RetroActionPriority) {
  if (priority === "high") return "Yuksek";
  if (priority === "medium") return "Orta";
  return "Dusuk";
}

function getActionStatusLabel(status: RetroActionStatus) {
  if (status === "planned") return "Planlandi";
  if (status === "in_progress") return "Devam ediyor";
  if (status === "completed") return "Tamamlandi";
  return "Acik";
}

function isOverdue(action: RetroActionItem) {
  return action.status !== "completed" && new Date(action.dueDate).getTime() < Date.now();
}

function isDueSoon(action: RetroActionItem) {
  const diff = new Date(action.dueDate).getTime() - Date.now();
  return action.status !== "completed" && diff > 0 && diff < 1000 * 60 * 60 * 24 * 3;
}

function InsightSection({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: string;
  tone: "positive" | "negative";
  items: RetroDetail["wentWell"];
}) {
  return (
    <section className="retro-panel h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
          <i className={`bi ${icon}`}></i>
          {title}
        </h2>
        <span className={`retro-chip ${tone === "positive" ? "retro-chip-positive" : "retro-chip-negative"}`}>
          {items.length} madde
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted mb-0">Bu bolum icin kayit bulunmuyor.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <article key={item.id} className={`retro-insight-card ${tone === "positive" ? "retro-insight-positive" : "retro-insight-negative"}`}>
              <p className="mb-2 fw-medium">{item.content}</p>
              <div className="d-flex flex-wrap gap-2 small text-muted">
                {item.votes ? <span>{item.votes} oy</span> : null}
                {item.tag ? <span className="retro-chip">{item.tag}</span> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function RetroHistoryDetail({ retro }: RetroHistoryDetailProps) {
  const [statusFilter, setStatusFilter] = useState<RetroActionStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<RetroActionPriority | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<RetroActionItem | null>(null);
  const [actions, setActions] = useState(retro.actions);
  const [toast, setToast] = useState<ToastState>(null);

  const assignees = useMemo(
    () => Array.from(new Set(retro.actions.map((action) => action.assigneeName).filter(Boolean))),
    [retro.actions]
  );

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      const matchesStatus = statusFilter === "all" || action.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || action.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === "all" || action.assigneeName === assigneeFilter;

      return matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [actions, assigneeFilter, priorityFilter, statusFilter]);

  const handleReminderSend = (payload: { subject: string; body: string }) => {
    if (!selectedAction) return;

    setActions((current) =>
      current.map((action) =>
        action.id === selectedAction.id
          ? {
              ...action,
              reminder: {
                status: "sent",
                lastSentAt: new Date().toISOString(),
              },
            }
          : action
      )
    );

    setToast({
      actionId: selectedAction.id,
      message: `${selectedAction.assigneeEmail ?? "Sorumlu kisi"} adresine hatirlatma gonderildi.`,
    });
    setSelectedAction(null);

    window.setTimeout(() => {
      setToast(null);
    }, 3000);

    void payload;
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <Link href="/retros" className="retro-inline-link">
            <i className="bi bi-arrow-left me-2"></i>
            Eski retrolara don
          </Link>
          <div className="d-flex flex-wrap gap-2 align-items-center mt-3 mb-2">
            <span className="retro-key">{retro.key}</span>
            <span className="retro-status-badge retro-status-needs-action">Retro Ozeti</span>
          </div>
          <h1 className="retro-title mb-2">{retro.title}</h1>
          <p className="text-muted mb-0 retro-subtitle">{retro.summary}</p>
        </div>

        <div className="retro-panel retro-summary-box">
          <div className="retro-metric-grid">
            <div>
              <span className="text-muted small d-block">Tarih</span>
              <strong>{formatDate(retro.date)}</strong>
            </div>
            <div>
              <span className="text-muted small d-block">Takim</span>
              <strong>{retro.teamName}</strong>
            </div>
            <div>
              <span className="text-muted small d-block">Katilimci</span>
              <strong>{retro.participantCount}</strong>
            </div>
            <div>
              <span className="text-muted small d-block">Aksiyon</span>
              <strong>{actions.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {toast ? <div className="retro-toast">{toast.message}</div> : null}

      <div className="row g-4">
        <div className="col-xl-6">
          <InsightSection title="Iyi Yapilanlar" icon="bi-hand-thumbs-up" tone="positive" items={retro.wentWell} />
        </div>
        <div className="col-xl-6">
          <InsightSection title="Kotu Yapilanlar" icon="bi-exclamation-circle" tone="negative" items={retro.wentWrong} />
        </div>
      </div>

      <section className="retro-panel">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Katilimcilar</h2>
            <p className="text-muted mb-0">Retroya dahil olan ekip uyeleri ve katilim durumlari</p>
          </div>
          <span className="retro-chip">{retro.participants.length} kisi</span>
        </div>

        <div className="row g-3">
          {retro.participants.map((participant) => (
            <div key={participant.id} className="col-md-6 col-xl-4">
              <article className="retro-participant-card">
                <div className="d-flex align-items-center gap-3">
                  <div className="retro-avatar">{participant.avatarInitials}</div>
                  <div>
                    <h3 className="h6 fw-bold mb-1">{participant.name}</h3>
                    <p className="text-muted mb-1 small">{participant.role}</p>
                    <a href={`mailto:${participant.email}`} className="retro-inline-link small">
                      {participant.email}
                    </a>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="retro-chip">{getAttendanceLabel(participant.attendanceStatus)}</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="retro-panel">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Aksiyonlar</h2>
            <p className="text-muted mb-0">Sorumluluk, durum ve hatirlatma akisini tek ekranda yonetin.</p>
          </div>
          <span className="retro-chip retro-chip-warning">Hatirlatmalar UI simule edilir</span>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label htmlFor="action-status" className="form-label fw-semibold small text-uppercase mb-2">
              Durum
            </label>
            <select
              id="action-status"
              className="form-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as RetroActionStatus | "all")}
            >
              <option value="all">Tum durumlar</option>
              <option value="open">Acik</option>
              <option value="planned">Planlandi</option>
              <option value="in_progress">Devam ediyor</option>
              <option value="completed">Tamamlandi</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="action-priority" className="form-label fw-semibold small text-uppercase mb-2">
              Oncelik
            </label>
            <select
              id="action-priority"
              className="form-select"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value as RetroActionPriority | "all")}
            >
              <option value="all">Tum oncelikler</option>
              <option value="high">Yuksek</option>
              <option value="medium">Orta</option>
              <option value="low">Dusuk</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="action-assignee" className="form-label fw-semibold small text-uppercase mb-2">
              Sorumlu
            </label>
            <select
              id="action-assignee"
              className="form-select"
              value={assigneeFilter}
              onChange={(event) => setAssigneeFilter(event.target.value)}
            >
              <option value="all">Tum kisiler</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {filteredActions.map((action) => (
            <article
              key={action.id}
              className={`retro-action-card ${isOverdue(action) ? "retro-action-overdue" : isDueSoon(action) ? "retro-action-soon" : ""}`}
            >
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                <div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <span className="retro-chip">{getPriorityLabel(action.priority)}</span>
                    <span className="retro-chip">{getActionStatusLabel(action.status)}</span>
                    {action.reminder.status === "sent" ? (
                      <span className="retro-chip retro-chip-warning">Hatirlatma gonderildi</span>
                    ) : null}
                    {!action.assigneeName ? <span className="retro-chip retro-chip-negative">Sahipsiz aksiyon</span> : null}
                  </div>
                  <h3 className="h5 fw-bold mb-1">{action.title}</h3>
                  <p className="text-muted mb-0">{action.description}</p>
                </div>

                <button
                  type="button"
                  className="btn btn-soft-secondary"
                  disabled={!action.assigneeEmail}
                  onClick={() => setSelectedAction(action)}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Hatirlatma Gonder
                </button>
              </div>

              <div className="row g-3 small">
                <div className="col-md-3">
                  <span className="text-muted d-block mb-1">Sorumlu kisi</span>
                  <strong>{action.assigneeName ?? "Atanmadi"}</strong>
                  {action.assigneeEmail ? <div className="text-muted mt-1">{action.assigneeEmail}</div> : null}
                </div>
                <div className="col-md-3">
                  <span className="text-muted d-block mb-1">Son tarih</span>
                  <strong>{formatDate(action.dueDate)}</strong>
                </div>
                <div className="col-md-3">
                  <span className="text-muted d-block mb-1">Olusturulma</span>
                  <strong>{formatDate(action.createdAt)}</strong>
                </div>
                <div className="col-md-3">
                  <span className="text-muted d-block mb-1">Son hatirlatma</span>
                  <strong>{formatDateTime(action.reminder.lastSentAt)}</strong>
                </div>
              </div>
            </article>
          ))}

          {filteredActions.length === 0 ? (
            <div className="retro-empty-inline">Secili filtrelerle eslesen aksiyon bulunamadi.</div>
          ) : null}
        </div>
      </section>

      {selectedAction ? (
        <ReminderModal
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          onSend={handleReminderSend}
        />
      ) : null}
    </div>
  );
}