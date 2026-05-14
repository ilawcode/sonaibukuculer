import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-retro px-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "rgba(255,255,255,0.5)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            <i className="bi bi-arrow-repeat"></i>
          </span>
          <span>
            <span style={{ fontWeight: 800, letterSpacing: 3, fontSize: "1rem" }}>LEAN</span>
            <span style={{ fontWeight: 500, fontSize: "0.75rem", opacity: 0.7, marginLeft: 4 }}>
              Retro
            </span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                <i className="bi bi-house me-1"></i>
                Ana Sayfa
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/sessions">
                <i className="bi bi-collection me-1"></i>
                Oturumlar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
