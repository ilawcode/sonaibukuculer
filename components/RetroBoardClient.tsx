"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ColumnKey = "good" | "bad";

type RetroCard = {
  id: string;
  text: string;
  author: string;
  votes: number;
  votedBy: string[];
  isNew?: boolean;
};

type Participant = {
  id: string;
  nickname: string;
  online: boolean;
};

type ActionStatus = "Açık" | "Planlandı" | "Devam Ediyor" | "Tamamlandı";
type ActionPriority = "Yüksek" | "Orta" | "Düşük";

type RetroAction = {
  id: string;
  description: string;
  cardId: string | null;
  owner: string;
  status: ActionStatus;
  priority: ActionPriority;
  createdAt: number;
};

const STATUS_OPTIONS: ActionStatus[] = [
  "Açık",
  "Planlandı",
  "Devam Ediyor",
  "Tamamlandı",
];

const PRIORITY_OPTIONS: ActionPriority[] = ["Yüksek", "Orta", "Düşük"];

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

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function generateCardId(): string {
  return generateId("c");
}

function generateActionId(): string {
  return generateId("a");
}

function truncate(text: string, max = 60): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function statusClass(status: ActionStatus): string {
  switch (status) {
    case "Açık":
      return "action-badge action-badge--status-open";
    case "Planlandı":
      return "action-badge action-badge--status-planned";
    case "Devam Ediyor":
      return "action-badge action-badge--status-progress";
    case "Tamamlandı":
      return "action-badge action-badge--status-done";
  }
}

function priorityClass(priority: ActionPriority): string {
  switch (priority) {
    case "Yüksek":
      return "action-badge action-badge--prio-high";
    case "Orta":
      return "action-badge action-badge--prio-med";
    case "Düşük":
      return "action-badge action-badge--prio-low";
  }
}

const CURRENT_USER_NICK = "kaplanGoz";

export default function RetroBoardClient() {
  const [retroKey, setRetroKey] = useState<string>("------");
  const [retroTitle, setRetroTitle] = useState<string>("Sprint 24 Retrospektifi");
  const [editingTitle, setEditingTitle] = useState<boolean>(false);

  const [goodCards, setGoodCards] = useState<RetroCard[]>([
    {
      id: generateCardId(),
      text: "Kod review süresi belirgin şekilde kısaldı.",
      author: "blueWolf",
      votes: 3,
      votedBy: ["blueWolf", "denizYildizi", "kaplanGoz"],
    },
    {
      id: generateCardId(),
      text: "Daily standup'lar daha odaklı geçti.",
      author: "denizYildizi",
      votes: 1,
      votedBy: ["kodCanavari"],
    },
  ]);
  const [badCards, setBadCards] = useState<RetroCard[]>([
    {
      id: generateCardId(),
      text: "Sprint planlama toplantısı çok uzun sürdü.",
      author: "kodCanavari",
      votes: 4,
      votedBy: ["kaplanGoz", "blueWolf", "denizYildizi", "ayKizi"],
    },
  ]);

  const [actions, setActions] = useState<RetroAction[]>([]);

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
      votes: 0,
      votedBy: [],
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
    setActions((prev) =>
      prev.map((a) => (a.cardId === id ? { ...a, cardId: null } : a))
    );
  };

  const handleVote = (column: ColumnKey, id: string) => {
    const updater = (prev: RetroCard[]) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const hasVoted = c.votedBy.includes(CURRENT_USER_NICK);
        return hasVoted
          ? {
              ...c,
              votes: Math.max(0, c.votes - 1),
              votedBy: c.votedBy.filter((n) => n !== CURRENT_USER_NICK),
            }
          : {
              ...c,
              votes: c.votes + 1,
              votedBy: [...c.votedBy, CURRENT_USER_NICK],
            };
      });
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

  const allCards = useMemo(() => {
    const tagged = [
      ...goodCards.map((c) => ({ ...c, variant: "good" as ColumnKey })),
      ...badCards.map((c) => ({ ...c, variant: "bad" as ColumnKey })),
    ];
    return tagged;
  }, [goodCards, badCards]);

  const cardById = useMemo(() => {
    const map = new Map<string, (typeof allCards)[number]>();
    for (const c of allCards) map.set(c.id, c);
    return map;
  }, [allCards]);

  const topVotedCards = useMemo(() => {
    return allCards
      .filter((c) => c.text.trim().length > 0 && c.votes > 0)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
  }, [allCards]);

  const maxVotes = topVotedCards[0]?.votes ?? 0;

  const handleCreateAction = (cardId: string | null) => {
    const newAction: RetroAction = {
      id: generateActionId(),
      description: "",
      cardId,
      owner: CURRENT_USER_NICK,
      status: "Açık",
      priority: "Orta",
      createdAt: Date.now(),
    };
    setActions((prev) => [newAction, ...prev]);
  };

  const handleUpdateAction = (id: string, patch: Partial<RetroAction>) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const handleDeleteAction = (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

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
                  if (e.key === "Enter" || e.key === "Escape")
                    setEditingTitle(false);
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
                <i
                  className="bi bi-circle-fill text-success me-1"
                  style={{ fontSize: 8 }}
                ></i>
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
              <i
                className={`bi ${
                  shareCopied ? "bi-check2-circle" : "bi-link-45deg"
                } me-2`}
              ></i>
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
            onVote={(id) => handleVote("good", id)}
            currentUser={CURRENT_USER_NICK}
          />
          <RetroColumn
            variant="bad"
            title="Kötü Gidenler"
            icon="bi-emoji-frown"
            cards={badCards}
            onAdd={() => handleAddCard("bad")}
            onUpdate={(id, text) => handleUpdateCard("bad", id, text)}
            onDelete={(id) => handleDeleteCard("bad", id)}
            onVote={(id) => handleVote("bad", id)}
            currentUser={CURRENT_USER_NICK}
          />
        </div>

        <ActionTrackerSection
          actions={actions}
          topVotedCards={topVotedCards}
          maxVotes={maxVotes}
          allCards={allCards}
          cardById={cardById}
          participants={DUMMY_PARTICIPANTS}
          onCreate={handleCreateAction}
          onUpdate={handleUpdateAction}
          onDelete={handleDeleteAction}
        />
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
  onVote: (id: string) => void;
  currentUser: string;
}) {
  const {
    variant,
    title,
    icon,
    cards,
    onAdd,
    onUpdate,
    onDelete,
    onVote,
    currentUser,
  } = props;

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
              onVote={() => onVote(card.id)}
              hasVoted={card.votedBy.includes(currentUser)}
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
  onVote: () => void;
  hasVoted: boolean;
}) {
  const { variant, card, onUpdate, onDelete, onVote, hasVoted } = props;
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
      <div className="retro-card-footer">
        <button
          type="button"
          className={`retro-vote-btn ${
            hasVoted ? "retro-vote-btn--active" : ""
          }`}
          onClick={onVote}
          aria-pressed={hasVoted}
          title={hasVoted ? "Oyu geri al" : "Oy ver"}
          disabled={!card.text.trim()}
        >
          <i className={`bi ${hasVoted ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}`}></i>
          <span className="retro-vote-count">{card.votes}</span>
        </button>
      </div>
    </div>
  );
}

function ActionTrackerSection(props: {
  actions: RetroAction[];
  topVotedCards: Array<RetroCard & { variant: ColumnKey }>;
  maxVotes: number;
  allCards: Array<RetroCard & { variant: ColumnKey }>;
  cardById: Map<string, RetroCard & { variant: ColumnKey }>;
  participants: Participant[];
  onCreate: (cardId: string | null) => void;
  onUpdate: (id: string, patch: Partial<RetroAction>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    actions,
    topVotedCards,
    maxVotes,
    allCards,
    cardById,
    participants,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  return (
    <section className="retro-actions">
      <div className="retro-actions-header">
        <div className="retro-actions-title">
          <span className="retro-actions-icon">
            <i className="bi bi-check2-square"></i>
          </span>
          <div>
            <h3 className="retro-actions-h">Aksiyon Takip Tablosu</h3>
            <p className="retro-actions-sub">
              Oylamada öne çıkan maddeler için aksiyon planı oluştur ve takip et.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-soft-primary retro-actions-add-btn"
          onClick={() => onCreate(null)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Aksiyon Ekle
        </button>
      </div>

      <div className="retro-actions-spotlight">
        <div className="retro-spotlight-head">
          <i className="bi bi-fire me-2" style={{ color: "#d47a4a" }}></i>
          <span>En Çok Oy Alan Maddeler</span>
        </div>
        {topVotedCards.length === 0 ? (
          <div className="retro-spotlight-empty">
            <i className="bi bi-emoji-neutral me-2"></i>
            Henüz oylanmış bir madde yok. Kartlara oy verildikçe burada
            görüntülenecek.
          </div>
        ) : (
          <div className="retro-spotlight-grid">
            {topVotedCards.map((card, idx) => (
              <div
                key={card.id}
                className={`retro-spotlight-card retro-spotlight-card--${card.variant} ${
                  card.votes === maxVotes ? "retro-spotlight-card--top" : ""
                }`}
              >
                <div className="retro-spotlight-rank">#{idx + 1}</div>
                <div className="retro-spotlight-meta">
                  <span
                    className={`retro-spotlight-chip retro-spotlight-chip--${card.variant}`}
                  >
                    {card.variant === "good" ? "İyi Gidenler" : "Kötü Gidenler"}
                  </span>
                  <span className="retro-spotlight-votes">
                    <i className="bi bi-hand-thumbs-up-fill me-1"></i>
                    {card.votes} oy
                  </span>
                </div>
                <p className="retro-spotlight-text">{truncate(card.text, 110)}</p>
                <button
                  type="button"
                  className="retro-spotlight-btn"
                  onClick={() => onCreate(card.id)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Aksiyon Ekle
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="retro-actions-table-wrap">
        {actions.length === 0 ? (
          <div className="retro-actions-empty">
            <i className="bi bi-clipboard-check me-2"></i>
            Henüz aksiyon yok. Yukarıdan bir madde seçerek aksiyon oluşturabilirsin.
          </div>
        ) : (
          <table className="retro-actions-table">
            <thead>
              <tr>
                <th className="retro-th-num">#</th>
                <th>Aksiyon</th>
                <th className="retro-th-related">İlişkili Madde</th>
                <th className="retro-th-owner">Sorumlu</th>
                <th className="retro-th-status">Durum</th>
                <th className="retro-th-prio">Öncelik</th>
                <th className="retro-th-actions" aria-label="İşlemler"></th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action, idx) => (
                <ActionRow
                  key={action.id}
                  index={idx + 1}
                  action={action}
                  card={action.cardId ? cardById.get(action.cardId) ?? null : null}
                  allCards={allCards}
                  participants={participants}
                  onUpdate={(patch) => onUpdate(action.id, patch)}
                  onDelete={() => onDelete(action.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function ActionRow(props: {
  index: number;
  action: RetroAction;
  card: (RetroCard & { variant: ColumnKey }) | null;
  allCards: Array<RetroCard & { variant: ColumnKey }>;
  participants: Participant[];
  onUpdate: (patch: Partial<RetroAction>) => void;
  onDelete: () => void;
}) {
  const { index, action, card, allCards, participants, onUpdate, onDelete } =
    props;
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [desc, setDesc] = useState<string>(action.description);

  useEffect(() => {
    setDesc(action.description);
  }, [action.description]);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(38, el.scrollHeight)}px`;
  }, [desc]);

  useEffect(() => {
    if (!action.description && descRef.current) {
      descRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <tr className="retro-actions-row">
      <td className="retro-td-num">{index}</td>
      <td>
        <textarea
          ref={descRef}
          className="retro-action-desc"
          placeholder="Aksiyon açıklamasını yaz…"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={() => onUpdate({ description: desc.trim() })}
          rows={1}
        />
      </td>
      <td>
        <div className="retro-action-related">
          <select
            className="retro-action-select retro-action-related-select"
            value={action.cardId ?? ""}
            onChange={(e) =>
              onUpdate({ cardId: e.target.value ? e.target.value : null })
            }
          >
            <option value="">— İlgisiz —</option>
            {allCards
              .filter((c) => c.text.trim().length > 0)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.variant === "good" ? "İyi · " : "Kötü · "}
                  {truncate(c.text, 50)}
                </option>
              ))}
          </select>
          {card && (
            <span
              className={`retro-related-chip retro-related-chip--${card.variant}`}
              title={card.text}
            >
              <i
                className={`bi ${
                  card.variant === "good" ? "bi-emoji-smile" : "bi-emoji-frown"
                } me-1`}
              ></i>
              {truncate(card.text, 30)}
            </span>
          )}
        </div>
      </td>
      <td>
        <select
          className="retro-action-select"
          value={action.owner}
          onChange={(e) => onUpdate({ owner: e.target.value })}
        >
          {participants.map((p) => (
            <option key={p.id} value={p.nickname}>
              {p.nickname}
            </option>
          ))}
        </select>
      </td>
      <td>
        <div className="retro-action-badge-cell">
          <span className={statusClass(action.status)}>{action.status}</span>
          <select
            className="retro-action-select retro-action-select--ghost"
            value={action.status}
            onChange={(e) =>
              onUpdate({ status: e.target.value as ActionStatus })
            }
            aria-label="Durum"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td>
        <div className="retro-action-badge-cell">
          <span className={priorityClass(action.priority)}>
            {action.priority}
          </span>
          <select
            className="retro-action-select retro-action-select--ghost"
            value={action.priority}
            onChange={(e) =>
              onUpdate({ priority: e.target.value as ActionPriority })
            }
            aria-label="Öncelik"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="retro-td-actions">
        <button
          type="button"
          className="retro-action-delete"
          onClick={onDelete}
          aria-label="Aksiyonu sil"
          title="Aksiyonu sil"
        >
          <i className="bi bi-trash3"></i>
        </button>
      </td>
    </tr>
  );
}
