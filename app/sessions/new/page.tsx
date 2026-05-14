"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreatedSession {
  _id: string;
  retroKey: string;
  title: string;
}

export default function NewSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    title: "",
    teamName: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Bir hata oluştu");
        return;
      }

      setCreated({ _id: data.data._id, retroKey: data.data.retroKey, title: data.data.title });
    } catch {
      setError("Sunucuya bağlanılamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (created?.retroKey) {
      navigator.clipboard?.writeText(created.retroKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (created) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="retro-card p-4 p-md-5 text-center">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 72, height: 72, background: "var(--soft-lila-light)" }}
            >
              <i className="bi bi-check-lg fs-2" style={{ color: "var(--soft-lila-dark)" }}></i>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
              Retro Oluşturuldu!
            </h3>
            <p className="text-muted mb-4">{created.title}</p>

            <p className="text-muted small mb-2 fw-semibold">KATILIM KODU</p>
            <div
              className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded-3 mb-4"
              style={{
                background: "var(--soft-blue-light)",
                border: "2px solid var(--soft-blue)",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 800,
                  fontSize: "2rem",
                  letterSpacing: 6,
                  color: "var(--text-main)",
                }}
              >
                {created.retroKey}
              </span>
              <button
                className="btn btn-sm"
                onClick={handleCopy}
                style={{ border: "none", background: "transparent" }}
                title="Kopyala"
              >
                <i
                  className={`bi ${copied ? "bi-clipboard-check text-success" : "bi-clipboard"}`}
                  style={{ fontSize: "1.2rem" }}
                ></i>
              </button>
            </div>

            <p className="text-muted small mb-4">
              Bu kodu katılımcılarla paylaşın. Onlar ana sayfadaki "Retro&apos;ya Katıl" bölümünden bu kodla oturuma katılabilir.
            </p>

            <button
              className="btn btn-soft-primary w-100"
              onClick={() => router.push(`/sessions/${created._id}`)}
            >
              <i className="bi bi-play-circle me-2"></i>
              Retro Board&apos;a Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="retro-card p-4 p-md-5">
          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            <i className="bi bi-plus-circle me-2"></i>
            Yeni Retro Oturumu
          </h2>
          <p className="text-muted mb-4">
            Takımınız için yeni bir retrospektif oturumu başlatın.
          </p>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Oturum Başlığı <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Örn: Sprint 24 Retrospektifi"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="teamName" className="form-label fw-semibold">
                Takım Adı
              </label>
              <input
                type="text"
                className="form-control"
                id="teamName"
                placeholder="Örn: Frontend Takımı"
                value={form.teamName}
                onChange={(e) => setForm({ ...form, teamName: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-semibold">
                Açıklama
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={3}
                placeholder="Oturum hakkında kısa bir açıklama..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-soft-primary flex-grow-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Oturum Oluştur
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.back()}
                disabled={loading}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
