import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <div
        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
        style={{
          width: 100,
          height: 100,
          background: "var(--soft-lila-light)",
        }}
      >
        <i className="bi bi-question-circle fs-1" style={{ color: "var(--soft-lila-dark)" }}></i>
      </div>
      <h2 className="fw-bold mb-2" style={{ color: "var(--text-main)" }}>
        Sayfa Bulunamadı
      </h2>
      <p className="text-muted mb-4">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link href="/" className="btn btn-soft-primary">
        <i className="bi bi-house me-2"></i>
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
