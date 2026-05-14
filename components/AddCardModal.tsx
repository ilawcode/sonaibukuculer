"use client";

import { useEffect, useRef, useState } from "react";
import { ICard } from "@/models/Card";
import { CardType, CARD_TYPES } from "@/types";

interface AddCardModalProps {
  sessionId: string;
  defaultType: CardType;
  onClose: () => void;
  onCardAdded: (card: ICard) => void;
}

export default function AddCardModal({ sessionId, defaultType, onClose, onCardAdded }: AddCardModalProps) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm]       = useState({ type: defaultType, content: "" });

  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Anonim: author gönderilmiyor
        body: JSON.stringify({ sessionId, type: form.type, content: form.content }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Bir hata oluştu"); return; }
      onCardAdded(data.data);
    } catch { setError("Sunucuya bağlanılamadı"); }
    finally  { setLoading(false); }
  };

  return (
    <div
      ref={backdropRef}
      className="modal d-block"
      style={{ background: "rgba(60,60,100,0.3)", backdropFilter: "blur(2px)" }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="addCardModalTitle"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="addCardModalTitle">
              <i className="bi bi-plus-circle me-2"></i>Yeni Kart Ekle
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Kapat"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>{error}
                </div>
              )}

              {/* Type Selector */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Kategori</label>
                <div className="d-flex gap-2 flex-wrap">
                  {(Object.entries(CARD_TYPES) as [CardType, typeof CARD_TYPES[CardType]][]).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      className={`btn btn-sm ${form.type === key ? "btn-soft-primary" : "btn-outline-secondary"}`}
                      onClick={() => setForm({ ...form, type: key })}
                    >
                      <i className={`bi ${info.icon} me-1`}></i>{info.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="mb-1">
                <label htmlFor="cardContent" className="form-label fw-semibold">
                  İçerik <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="cardContent"
                  rows={3}
                  placeholder="Kartın içeriğini yazın... (anonim)"
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  required
                  autoFocus
                  maxLength={500}
                />
                <div className="form-text">{form.content.length}/500 — Kartlar anonim olarak eklenir.</div>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>İptal</button>
              <button type="submit" className="btn btn-soft-primary" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Ekleniyor...</>
                  : <><i className="bi bi-check-circle me-2"></i>Kart Ekle</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
