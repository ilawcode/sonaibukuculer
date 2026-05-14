import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-retro px-3">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <i className="bi bi-arrow-repeat me-2"></i>
          Retro App
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
          <ul className="navbar-nav ms-auto">
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
            <li className="nav-item">
              <Link className="nav-link" href="/sessions/new">
                <i className="bi bi-plus-circle me-1"></i>
                Yeni Oturum
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
