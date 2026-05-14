"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ActivePanel = "join" | "create" | null;

export default function LandingDashboard() {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  // Join with key
  const [retroKey, setRetroKey] = useState("");
  const [userName, setUserName] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  // Create new retro
  const [createName, setCreateName] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createTeam, setCreateTeam] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !retroKey.trim()) return;
    setJoinLoading(true);
    setJoinError("");

    try {
      const res = await fetch(`/api/sessions/key/${retroKey.trim().toUpperCase()}`);
      const data = await res.json();

      if (!data.success) {
        setJoinError("Retro bulunamadı. Anahtarı kontrol edin.");
        return;
      }

      // Store username in sessionStorage
      sessionStorage.setItem("lean_user", userName.trim());
      router.push(`/sessions/${data.data._id}`);
    } catch {
      setJoinError("Sunucuya bağlanılamadı.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createTitle.trim()) return;
    setCreateLoading(true);
    setCreateError("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createTitle.trim(),
          teamName: createTeam.trim(),
          createdBy: createName.trim(),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setCreateError(data.error || "Bir hata oluştu.");
        return;
      }

      sessionStorage.setItem("lean_user", createName.trim());
      router.push(`/sessions/${data.data._id}`);
    } catch {
      setCreateError("Sunucuya bağlanılamadı.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="lean-landing">
      {/* ── TOP BRAND BAR ── */}
      <div className="lean-brand-bar">
        <div className="lean-logo">
          <span className="lean-logo-icon">
            <i className="bi bi-arrow-repeat"></i>
          </span>
          <div>
            <span className="lean-logo-title">LEAN</span>
            <span className="lean-logo-sub">Retro</span>
          </div>
        </div>
        <p className="lean-tagline">
          Takımınızla daha iyi retrospektifler için tasarlandı.
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="lean-main">

        {/* ── LEFT: HERO ── */}
        <div className="lean-hero">
          <div className="lean-hero-inner">
            <h1 className="lean-hero-title">
              Retrospektifi<br />
              <span className="lean-hero-accent">güçlü</span> yapın.
            </h1>
            <p className="lean-hero-desc">
              LEAN Retro ile sprint sonlarını anlamlı geri bildirimlere dönüştürün.
              Kartlarınızı ekleyin, oylayın ve aksiyonlarınızı takip edin.
            </p>

            {/* Stats */}
            <div className="lean-stats">
              <div className="lean-stat">
                <span className="lean-stat-icon" style={{ background: "var(--soft-mint)" }}>
                  <i className="bi bi-hand-thumbs-up" style={{ color: "#2a6a4a" }}></i>
                </span>
                <div>
                  <div className="lean-stat-label">İyi Giden</div>
                  <div className="lean-stat-desc">Başarıları kutlayın</div>
                </div>
              </div>
              <div className="lean-stat">
                <span className="lean-stat-icon" style={{ background: "var(--soft-peach)" }}>
                  <i className="bi bi-arrow-up-circle" style={{ color: "#7a4a1a" }}></i>
                </span>
                <div>
                  <div className="lean-stat-label">Geliştirilecek</div>
                  <div className="lean-stat-desc">Fırsatları belirleyin</div>
                </div>
              </div>
              <div className="lean-stat">
                <span className="lean-stat-icon" style={{ background: "var(--soft-blue)" }}>
                  <i className="bi bi-lightning" style={{ color: "#1a4a7a" }}></i>
                </span>
                <div>
                  <div className="lean-stat-label">Aksiyon</div>
                  <div className="lean-stat-desc">Adımları takip edin</div>
                </div>
              </div>
              <div className="lean-stat">
                <span className="lean-stat-icon" style={{ background: "var(--soft-pink)" }}>
                  <i className="bi bi-star" style={{ color: "#7a1a4a" }}></i>
                </span>
                <div>
                  <div className="lean-stat-label">Tebrik</div>
                  <div className="lean-stat-desc">Takımı motive edin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: ACTION PANEL ── */}
        <div className="lean-panel-area">

          {/* Selector Buttons */}
          {activePanel === null && (
            <div className="lean-selector">
              <div className="lean-selector-header">
                <i className="bi bi-door-open me-2"></i>
                Nasıl devam etmek istersiniz?
              </div>

              <button
                className="lean-action-btn lean-action-join"
                onClick={() => setActivePanel("join")}
              >
                <span className="lean-action-btn-icon">
                  <i className="bi bi-key"></i>
                </span>
                <div className="lean-action-btn-text">
                  <strong>Retroya Katıl</strong>
                  <span>Elinizde bir retro anahtarı var</span>
                </div>
                <i className="bi bi-chevron-right lean-action-btn-arrow"></i>
              </button>

              <button
                className="lean-action-btn lean-action-create"
                onClick={() => setActivePanel("create")}
              >
                <span className="lean-action-btn-icon">
                  <i className="bi bi-plus-circle"></i>
                </span>
                <div className="lean-action-btn-text">
                  <strong>Yeni Retro Başlat</strong>
                  <span>Takımınız için yeni bir oturum açın</span>
                </div>
                <i className="bi bi-chevron-right lean-action-btn-arrow"></i>
              </button>
            </div>
          )}

          {/* Join Panel */}
          {activePanel === "join" && (
            <div className="lean-form-card">
              <button
                className="lean-back-btn"
                onClick={() => { setActivePanel(null); setJoinError(""); }}
              >
                <i className="bi bi-arrow-left me-1"></i> Geri
              </button>

              <div className="lean-form-header">
                <span className="lean-form-icon" style={{ background: "var(--soft-blue-light)" }}>
                  <i className="bi bi-key" style={{ color: "var(--soft-blue-dark)" }}></i>
                </span>
                <div>
                  <h4 className="mb-0 fw-bold">Retroya Katıl</h4>
                  <p className="text-muted small mb-0">Retro anahtarınızı girin</p>
                </div>
              </div>

              {joinError && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  {joinError}
                </div>
              )}

              <form onSubmit={handleJoin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Adınız</label>
                  <div className="input-group">
                    <span className="input-group-text lean-input-icon">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adınızı girin"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Retro Anahtarı</label>
                  <div className="input-group">
                    <span className="input-group-text lean-input-icon">
                      <i className="bi bi-hash"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control lean-key-input"
                      placeholder="Örn: LEAN-2024-A1B2"
                      value={retroKey}
                      onChange={(e) => setRetroKey(e.target.value.toUpperCase())}
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="form-text">
                    Retro sahibinden aldığınız anahtarı girin.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-soft-primary w-100"
                  disabled={joinLoading}
                >
                  {joinLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Aranıyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Retroya Gir
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Create Panel */}
          {activePanel === "create" && (
            <div className="lean-form-card">
              <button
                className="lean-back-btn"
                onClick={() => { setActivePanel(null); setCreateError(""); }}
              >
                <i className="bi bi-arrow-left me-1"></i> Geri
              </button>

              <div className="lean-form-header">
                <span className="lean-form-icon" style={{ background: "var(--soft-lila-light)" }}>
                  <i className="bi bi-plus-circle" style={{ color: "var(--soft-lila-dark)" }}></i>
                </span>
                <div>
                  <h4 className="mb-0 fw-bold">Yeni Retro</h4>
                  <p className="text-muted small mb-0">Oturum oluşturun ve paylaşın</p>
                </div>
              </div>

              {createError && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Adınız</label>
                  <div className="input-group">
                    <span className="input-group-text lean-input-icon">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adınızı girin"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Retro Başlığı</label>
                  <div className="input-group">
                    <span className="input-group-text lean-input-icon">
                      <i className="bi bi-card-heading"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Sprint 24 Retrospektifi"
                      value={createTitle}
                      onChange={(e) => setCreateTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">
                    Takım Adı <span className="text-muted fw-normal">(opsiyonel)</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text lean-input-icon">
                      <i className="bi bi-people"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Frontend Takımı"
                      value={createTeam}
                      onChange={(e) => setCreateTeam(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-soft-secondary w-100"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-rocket-takeoff me-2"></i>
                      Retroyu Başlat
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Bottom hint */}
          <p className="lean-hint">
            <i className="bi bi-shield-check me-1"></i>
            Hesap oluşturmanıza gerek yok. Hızlı ve güvenli.
          </p>
        </div>
      </div>
    </div>
  );
}
