import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="hero-section text-center">
        <h1 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>
          <i className="bi bi-arrow-repeat me-2"></i>
          Retro App
        </h1>
        <p className="lead mb-4" style={{ color: "var(--text-muted)" }}>
          Takımınızla retrospektif toplantılarınızı kolayca yönetin.
          <br />
          İyi gidenleri, geliştirilecekleri ve aksiyonları bir arada takip edin.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/retro" className="btn btn-soft-primary btn-lg px-4">
            <i className="bi bi-stars me-2"></i>
            Create Retro
          </Link>
          <Link href="/sessions/new" className="btn btn-soft-secondary btn-lg px-4">
            <i className="bi bi-plus-circle me-2"></i>
            Yeni Oturum Başlat
          </Link>
          <Link href="/sessions" className="btn btn-soft-secondary btn-lg px-4">
            <i className="bi bi-collection me-2"></i>
            Oturumları Gör
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="row g-4 mt-2">
        <div className="col-md-3">
          <div className="retro-card p-4 text-center h-100">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                background: "var(--soft-mint)",
              }}
            >
              <i className="bi bi-hand-thumbs-up fs-4" style={{ color: "#2a6a4a" }}></i>
            </div>
            <h5 className="fw-semibold">İyi Giden</h5>
            <p className="text-muted small mb-0">
              Sprint boyunca iyi giden şeyleri kaydedin ve kutlayın.
            </p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="retro-card p-4 text-center h-100">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                background: "var(--soft-peach)",
              }}
            >
              <i className="bi bi-arrow-up-circle fs-4" style={{ color: "#7a4a1a" }}></i>
            </div>
            <h5 className="fw-semibold">Geliştirilecek</h5>
            <p className="text-muted small mb-0">
              İyileştirme fırsatlarını belirleyin ve tartışın.
            </p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="retro-card p-4 text-center h-100">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                background: "var(--soft-blue)",
              }}
            >
              <i className="bi bi-lightning fs-4" style={{ color: "#1a4a7a" }}></i>
            </div>
            <h5 className="fw-semibold">Aksiyon</h5>
            <p className="text-muted small mb-0">
              Somut adımlar belirleyin ve takip edin.
            </p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="retro-card p-4 text-center h-100">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                background: "var(--soft-pink)",
              }}
            >
              <i className="bi bi-star fs-4" style={{ color: "#7a1a4a" }}></i>
            </div>
            <h5 className="fw-semibold">Tebrik</h5>
            <p className="text-muted small mb-0">
              Takım üyelerini takdir edin ve motive edin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
