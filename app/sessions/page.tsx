import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import { ISession } from "@/models/Session";
import { SESSION_STATUSES } from "@/types";

async function getSessions(): Promise<ISession[]> {
  await connectDB();
  const sessions = await Session.find().sort({ createdAt: -1 }).lean();
  return sessions as unknown as ISession[];
}

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            <i className="bi bi-collection me-2"></i>
            Retro Oturumları
          </h2>
          <p className="text-muted mb-0">{sessions.length} oturum bulundu</p>
        </div>
        <Link href="/sessions/new" className="btn btn-soft-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Oturum
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-5">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: 80,
              height: 80,
              background: "var(--soft-lila-light)",
            }}
          >
            <i className="bi bi-inbox fs-2" style={{ color: "var(--soft-lila-dark)" }}></i>
          </div>
          <h5 className="text-muted">Henüz oturum yok</h5>
          <p className="text-muted small">İlk retro oturumunuzu başlatın.</p>
          <Link href="/sessions/new" className="btn btn-soft-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Oturum Oluştur
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {sessions.map((session) => (
            <div key={String(session._id)} className="col-md-6 col-lg-4">
              <Link
                href={`/sessions/${session._id}`}
                className="text-decoration-none"
              >
                <div className="session-card p-4 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-semibold mb-0" style={{ color: "var(--text-main)" }}>
                      {session.title}
                    </h5>
                    {(() => {
                      const info = SESSION_STATUSES[session.status] ?? { label: session.status, icon: "bi-circle" };
                      return (
                        <span
                          className="badge rounded-pill"
                          style={{ background: info.color ?? "#e8e8f0", color: "var(--text-main)", fontSize: "0.7rem" }}
                        >
                          <i className={`bi ${info.icon} me-1`}></i>
                          {info.label}
                        </span>
                      );
                    })()}
                  </div>

                  {session.teamName && (
                    <p className="text-muted small mb-2">
                      <i className="bi bi-people me-1"></i>
                      {session.teamName}
                    </p>
                  )}

                  {session.description && (
                    <p
                      className="text-muted small mb-3"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {session.description}
                    </p>
                  )}

                  <p className="text-muted small mb-0 mt-auto">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(session.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
