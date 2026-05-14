"use client";

import { useMemo, useState } from "react";
import { RetroActionItem } from "@/types";

interface ReminderModalProps {
  action: RetroActionItem;
  onClose: () => void;
  onSend: (payload: { subject: string; body: string }) => void;
}

function formatDueDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReminderModal({ action, onClose, onSend }: ReminderModalProps) {
  const defaultBody = useMemo(() => {
    const lines = [
      `Merhaba ${action.assigneeName ?? "ekip arkadasi"},`,
      "",
      `"${action.title}" aksiyonu icin kisa bir hatirlatma paylasmak istedim.`,
      `Beklenen teslim tarihi: ${formatDueDate(action.dueDate)}.`,
      action.status !== "completed"
        ? "Uygun oldugunda guncel durumu paylasabilir misin?"
        : "Aksiyon tamamlandiysa kisa bir sonuc notu ekleyebilirsin.",
      "",
      "Tesekkurler,",
      "Retro App",
    ];

    return lines.join("\n");
  }, [action]);

  const [subject, setSubject] = useState(`Aksiyon Hatirlatmasi: ${action.title}`);
  const [body, setBody] = useState(defaultBody);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);

    window.setTimeout(() => {
      onSend({ subject, body });
      setIsSending(false);
    }, 500);
  };

  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-bold mb-1">Hatirlatma Gonder</h5>
              <p className="text-muted small mb-0">Mail akisi UI seviyesinde simule edilmektedir.</p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Kapat"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="retro-panel border mb-3">
                <div className="row g-3 small">
                  <div className="col-md-6">
                    <span className="text-muted d-block mb-1">Aksiyon</span>
                    <strong>{action.title}</strong>
                  </div>
                  <div className="col-md-3">
                    <span className="text-muted d-block mb-1">Sorumlu</span>
                    <strong>{action.assigneeName ?? "Atanmadi"}</strong>
                  </div>
                  <div className="col-md-3">
                    <span className="text-muted d-block mb-1">E-posta</span>
                    <strong>{action.assigneeEmail ?? "-"}</strong>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="reminder-subject" className="form-label fw-semibold">
                  Mail konusu
                </label>
                <input
                  id="reminder-subject"
                  className="form-control"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="reminder-body" className="form-label fw-semibold">
                  Mail icerigi
                </label>
                <textarea
                  id="reminder-body"
                  className="form-control"
                  rows={10}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Vazgec
              </button>
              <button
                type="submit"
                className="btn btn-soft-primary"
                disabled={isSending || !action.assigneeEmail}
              >
                {isSending ? "Gonderiliyor..." : "Gonder"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}