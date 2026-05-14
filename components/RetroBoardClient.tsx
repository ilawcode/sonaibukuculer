"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ColumnKey = "good" | "bad";

type RetroCard = {
  id: string;
  text: string;
  author: string;
  isNew?: boolean;
};

type Participant = {
  id: string;
  nickname: string;
  online: boolean;
};

const DUMMY_PARTICIPANTS: Participant[] = [
  { id: "p1", nickname: "kaplanGoz", online: true },
  { id: "p2", nickname: "blueWolf", online: true },
  { id: "p3", nickname: "denizYildizi", online: true },
  { id: "p4", nickname: "ayKizi", online: false },
  { id: "p5", nickname: "kodCanavari", online: true },
  { id: "p6", nickname: "pixelMaster", online: false },
];

const AVATAR_PALETTE = [
  { bg: "var(--soft-blue)", fg: "#1a4a7a" },
  { bg: "var(--soft-lila)", fg: "#4a2a7a" },
  { bg: "var(--soft-mint)", fg: "#2a6a4a" },
  { bg: "var(--soft-peach)", fg: "#7a4a1a" },
  { bg: "var(--soft-pink)", fg: "#7a1a4a" },
];

function pickAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

function generateRetroKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function generateCardId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const CURRENT_USER_NICK = "kaplanGoz";

export default function RetroBoardClient() {
  const [retroKey, setRetroKey] = useState<string>("------");
  const [retroTitle, setRetroTitle] = useState<string>("Sprint 24 Retrospektifi");
  const [editingTitle, setEditingTitle] = useState<boolean>(false);

  const [goodCards, setGoodCards] = useState<RetroCard[]>([
    { id: generateCardId(), text: "Kod review süresi belirgin şekilde kısaldı.", author: "blueWolf" },
    { id: generateCardId(), text: "Daily standup'lar daha odaklı geçti.", author: "denizYildizi" },
  ]);
  const [badCards, setBadCards] = useState<RetroCard[]>([
    { id: generateCardId(), text: "Sprint planlama toplantısı çok uzun sürdü.", author: "kodCanavari" },
  ]);

  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setRetroKey(generateRetroKey());
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/retro?key=${retroKey}`;
    return `${window.location.origin}/retro?key=${retroKey}`;
  }, [retroKey]);

  const handleAddCard = (column: ColumnKey) => {
    const newCard: RetroCard = {
      id: generateCardId(),
      text: "",
      author: CURRENT_USER_NICK,
      isNew: true,
    };
    if (column === "good") setGoodCards((prev) => [newCard, ...prev]);
    else setBadCards((prev) => [newCard, ...prev]);
  };

  const handleUpdateCard = (column: ColumnKey, id: string, text: string) => {
    const updater = (prev: RetroCard[]) =>
      prev.map((c) => (c.id === id ? { ...c, text, isNew: false } : c));
    if (column === "good") setGoodCards(updater);
    else setBadCards(updater);
  };

  const handleDeleteCard = (column: ColumnKey, id: string) => {
    const updater = (prev: RetroCard[]) => prev.filter((c) => c.id !== id);
    if (column === "good") setGoodCards(updater);
    else setBadCards(updater);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareCopied(false);
    }
  };

  const onlineCount = DUMMY_PARTICIPANTS.filter((p) => p.online).length;

  return (
    <div className="retro-shell">
      {/* Sol Panel - Katılımcılar */}
      <aside className="retro-sidebar">
        <div className="retro-sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0 fw-bold" style={{ color: "var(--text-main)" }}>
              <i className="bi bi-people-fill me-2"></i>
              Katılımcılar
            </h6>
            <span className="retro-pill">{DUMMY_PARTICIPANTS.length}</span>
          </div>
          <p className="retro-sidebar-sub">
            <span className="online-dot online-dot--on me-1"></span>
            {onlineCount} aktif şu an
          </p>
        </div>

        <ul className="retro-participant-list">
          {DUMMY_PARTICIPANTS.map((p) => {
            const palette = pickAvatarColor(p.nickname);
            const initial = p.nickname.charAt(0).toUpperCase();
            const isMe = p.nickname === CURRENT_USER_NICK;
            return (
              <li key={p.id} className="retro-participant">
                <div
                  className="retro-avatar"
                  style={{ background: palette.bg, color: palette.fg }}
                  aria-label={p.nickname}
                  title={p.nickname}
                >
                  {initial}
                  <span
                    className={`online-dot online-dot--corner ${
                      p.online ? "online-dot--on" : "online-dot--off"
                    }`}
                  ></span>
                </div>
                <div className="retro-participant-info">
                  <span className="retro-participant-nick">
                    {p.nickname}
                    {isMe && <span className="retro-me-badge">sen</span>}
                  </span>
                  <span className="retro-participant-status">
                    {p.online ? "Çevrimiçi" : "Çevrimdışı"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Sağ - Board */}
      <section className="retro-main">
        <header className="retro-header">
          <div className="retro-header-left">
            {editingTitle ? (
              <input
                autoFocus
                className="retro-title-input"
                value={retroTitle}
                onChange={(e) => setRetroTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false);
                }}
              />
            ) : (
              <h2
                className="retro-title"
                onClick={() => setEditingTitle(true)}
                title="Başlığı düzenlemek için tıkla"
              >
                {retroTitle || "İsimsiz Retro"}
                <i className="bi bi-pencil retro-title-edit"></i>
              </h2>
            )}
            <div className="retro-meta">
              <span className="retro-meta-item">
                <i className="bi bi-key me-1"></i>
                Retro Key:{" "}
                <span className="retro-key-chip">{retroKey}</span>
              </span>
              <span className="retro-meta-item">
                <i className="bi bi-circle-fill text-success me-1" style={{ fontSize: 8 }}></i>
                Aktif oturum
              </span>
            </div>
          </div>

          <div className="retro-header-right">
            <button
              type="button"
              className="btn btn-soft-primary retro-share-btn"
              onClick={handleShare}
            >
              <i className={`bi ${shareCopied ? "bi-check2-circle" : "bi-link-45deg"} me-2`}></i>
              {shareCopied ? "Link Kopyalandı" : "Share Link"}
            </button>
          </div>
        </header>

        <div className="retro-columns">
          <RetroColumn
            variant="good"
            title="İyi Gidenler"
            icon="bi-emoji-smile"
            cards={goodCards}
            onAdd={() => handleAddCard("good")}
            onUpdate={(id, text) => handleUpdateCard("good", id, text)}
            onDelete={(id) => handleDeleteCard("good", id)}
          />
          <RetroColumn
            variant="bad"
            title="Kötü Gidenler"
            icon="bi-emoji-frown"
            cards={badCards}
            onAdd={() => handleAddCard("bad")}
            onUpdate={(id, text) => handleUpdateCard("bad", id, text)}
            onDelete={(id) => handleDeleteCard("bad", id)}
          />
        </div>
      </section>
    </div>
  );
}

function RetroColumn(props: {
  variant: ColumnKey;
  title: string;
  icon: string;
  cards: RetroCard[];
  onAdd: () => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const { variant, title, icon, cards, onAdd, onUpdate, onDelete } = props;

  return (
    <div className={`retro-column retro-column--${variant}`}>
      <div className="retro-column-header">
        <div className="retro-column-title">
          <span className={`retro-column-icon retro-column-icon--${variant}`}>
            <i className={`bi ${icon}`}></i>
          </span>
          <span>{title}</span>
          <span className="retro-column-count">{cards.length}</span>
        </div>
        <button
          type="button"
          className={`retro-add-btn retro-add-btn--${variant}`}
          onClick={onAdd}
          aria-label={`${title} kolonuna kart ekle`}
          title="Yeni kart ekle"
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      <div className="retro-column-body">
        {cards.length === 0 ? (
          <button type="button" className="retro-empty" onClick={onAdd}>
            <i className="bi bi-plus-circle-dotted me-2"></i>
            İlk kartı ekle
          </button>
        ) : (
          cards.map((card) => (
            <RetroCardItem
              key={card.id}
              variant={variant}
              card={card}
              onUpdate={(text) => onUpdate(card.id, text)}
              onDelete={() => onDelete(card.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RetroCardItem(props: {
  variant: ColumnKey;
  card: RetroCard;
  onUpdate: (text: string) => void;
  onDelete: () => void;
}) {
  const { variant, card, onUpdate, onDelete } = props;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState<string>(card.text);

  useEffect(() => {
    setValue(card.text);
  }, [card.text]);

  useEffect(() => {
    if (card.isNew && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [card.isNew]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const palette = pickAvatarColor(card.author);

  return (
    <div className={`retro-card retro-card--${variant}`}>
      <div className="retro-card-top">
        <div
          className="retro-card-avatar"
          style={{ background: palette.bg, color: palette.fg }}
          title={card.author}
        >
          {card.author.charAt(0).toUpperCase()}
        </div>
        <span className="retro-card-author">{card.author}</span>
        <button
          type="button"
          className="retro-card-delete"
          onClick={onDelete}
          aria-label="Kartı sil"
          title="Kartı sil"
        >
          <i className="bi bi-trash3"></i>
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="retro-card-text"
        placeholder="Düşünceni yaz…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onUpdate(value.trim())}
        rows={2}
      />
    </div>
  );
}
