"use client";

import Link from "next/link";
import { useState } from "react";
import { findRetroByKey } from "@/lib/mockRetros";
import { RetroDetail } from "@/types";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OldRetrosPage() {
  const [retroKey, setRetroKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [resultRetro, setResultRetro] = useState<RetroDetail | null>(null);

  const handleKeyLookup = () => {
    const trimmedKey = retroKey.trim();

    if (!trimmedKey) return;

    setIsLoading(true);
    const retro = findRetroByKey(trimmedKey);

    window.setTimeout(() => {
      if (!retro) {
        setLookupError("Retro key bulunamadi. Lutfen key'i kontrol edip tekrar deneyin.");
        setResultRetro(null);
      } else {
        setLookupError("");
        setResultRetro(retro);
      }

      setIsLoading(false);
    }, 320);
  };

  const clearLookup = () => {
    setRetroKey("");
    setLookupError("");
    setResultRetro(null);
  };

  const onSubmitLookup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleKeyLookup();
  };

  return (
    <div className="d-flex flex-column gap-4">
      <section className="retro-hero retro-hero-enhanced py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-9">
            <div className="retro-panel retro-search-panel">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h1 className="h4 fw-bold mb-0" style={{ color: "var(--text-main)" }}>
                  Retro Cikti Erisimi
                </h1>
                <span className="retro-chip">Key ile Listeleme</span>
              </div>

              <p className="text-muted mb-3">
                Retro key girerek ilgili retro ciktisini aninda listeleyin.
              </p>

              <label htmlFor="retro-key" className="form-label small text-muted">
                Ornek: RETRO-PLT-240118
              </label>

              <form onSubmit={onSubmitLookup}>
                <div className="d-flex gap-2 flex-column flex-sm-row">
                  <input
                    id="retro-key"
                    className={`form-control ${lookupError ? "is-invalid" : ""}`}
                    placeholder="Retro key girin"
                    value={retroKey}
                    onChange={(event) => {
                      setRetroKey(event.target.value);
                      if (lookupError) setLookupError("");
                    }}
                    aria-invalid={Boolean(lookupError)}
                  />
                  <button
                    type="submit"
                    className="btn btn-soft-primary"
                    disabled={retroKey.trim().length === 0 || isLoading}
                  >
                    {isLoading ? "Araniyor..." : "Ciktilari Listele"}
                  </button>
                </div>
              </form>

              {lookupError ? <p className="text-danger small mt-2 mb-0">{lookupError}</p> : null}

              {lookupError ? (
                <div className="retro-error-guide mt-3">
                  <p className="mb-2 fw-semibold">Yonlendirme</p>
                  <ul className="mb-0">
                    <li>Retro key formatini kontrol edin.</li>
                    <li>Ornek key: RETRO-PLT-240118</li>
                    <li>Key bosluk iceriyorsa temizleyip tekrar deneyin.</li>
                  </ul>
                </div>
              ) : null}

              <div className="retro-search-hint mt-3">
                <i className="bi bi-shield-check me-2"></i>
                Sadece girdiginiz key'e ait retro ciktilari gosterilir.
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="row g-3">
          <div className="col-md-6 col-xl-3">
            <div className="retro-panel retro-skeleton" style={{ minHeight: 180 }}></div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="retro-panel retro-skeleton" style={{ minHeight: 180 }}></div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="retro-panel retro-skeleton" style={{ minHeight: 180 }}></div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="retro-panel retro-skeleton" style={{ minHeight: 180 }}></div>
          </div>
        </section>
      ) : null}

      {resultRetro ? (
        <section className="d-flex flex-column gap-3">
          <div className="retro-panel retro-result-header">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <span className="retro-key d-inline-flex mb-2">{resultRetro.key}</span>
                <h2 className="h3 fw-bold mb-1" style={{ color: "var(--text-main)" }}>
                  {resultRetro.title}
                </h2>
                <p className="text-muted mb-0">
                  {resultRetro.teamName} - {formatDate(resultRetro.date)}
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <Link href={`/retros/${resultRetro.id}`} className="btn btn-soft-primary">
                  <i className="bi bi-layout-text-window-reverse me-2"></i>
                  Detay Sayfasi
                </Link>
                <button type="button" className="btn btn-light" onClick={clearLookup}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Yeni Key Ara
                </button>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-xl-6">
              <OutputListCard
                title="Iyi Yapilanlar"
                icon="bi-hand-thumbs-up"
                toneClass="retro-output-positive"
                items={resultRetro.wentWell.map((item) => item.content)}
              />
            </div>
            <div className="col-xl-6">
              <OutputListCard
                title="Kotu Yapilanlar"
                icon="bi-exclamation-octagon"
                toneClass="retro-output-negative"
                items={resultRetro.wentWrong.map((item) => item.content)}
              />
            </div>
            <div className="col-xl-6">
              <OutputListCard
                title="Katilimcilar"
                icon="bi-people"
                toneClass="retro-output-neutral"
                items={resultRetro.participants.map(
                  (participant) => `${participant.name} - ${participant.role}`
                )}
              />
            </div>
            <div className="col-xl-6">
              <OutputListCard
                title="Aksiyonlar ve Sorumlular"
                icon="bi-lightning-charge"
                toneClass="retro-output-action"
                items={resultRetro.actions.map(
                  (action) =>
                    `${action.title} - ${action.assigneeName ?? "Atanmadi"} (${formatDate(action.dueDate)})`
                )}
              />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function OutputListCard({
  title,
  icon,
  toneClass,
  items,
}: {
  title: string;
  icon: string;
  toneClass: string;
  items: string[];
}) {
  return (
    <article className={`retro-panel retro-output-card ${toneClass}`}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
          <i className={`bi ${icon}`}></i>
          {title}
        </h3>
        <span className="retro-chip">{items.length} kayit</span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted mb-0">Bu bolumde gosterilecek veri yok.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((item, index) => (
            <div key={`${title}-${index}`} className="retro-output-item">
              <span className="retro-output-dot"></span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
