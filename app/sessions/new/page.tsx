"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

      router.push(`/sessions/${data.data._id}`);
    } catch {
      setError("Sunucuya bağlanılamadı");
    } finally {
      setLoading(false);
    }
  };

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
