"use client";

import { useState } from "react";
import { ISession } from "@/models/Session";
import { ICard, CardCategory } from "@/models/Card";
import CardColumn from "@/components/CardColumn";
import AddCardModal from "@/components/AddCardModal";

interface RetroBoardProps {
  session: ISession;
  initialCards: ICard[];
}

const COLUMNS: { category: CardCategory; label: string; icon: string; headerClass: string }[] = [
  {
    category: "went_well",
    label: "İyi Giden",
    icon: "bi-hand-thumbs-up",
    headerClass: "column-header-went-well",
  },
  {
    category: "to_improve",
    label: "Geliştirilecek",
    icon: "bi-arrow-up-circle",
    headerClass: "column-header-to-improve",
  },
  {
    category: "action_item",
    label: "Aksiyon",
    icon: "bi-lightning",
    headerClass: "column-header-action",
  },
  {
    category: "kudos",
    label: "Tebrik",
    icon: "bi-star",
    headerClass: "column-header-kudos",
  },
];

export default function RetroBoard({ session, initialCards }: RetroBoardProps) {
  const [cards, setCards] = useState<ICard[]>(initialCards);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>("went_well");

  const handleAddCard = (category: CardCategory) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCardAdded = (newCard: ICard) => {
    setCards((prev) => [newCard, ...prev]);
    setShowModal(false);
  };

  const handleCardDeleted = (cardId: string) => {
    setCards((prev) => prev.filter((c) => String(c._id) !== cardId));
  };

  const handleCardVoted = (updatedCard: ICard) => {
    setCards((prev) =>
      prev.map((c) => (String(c._id) === String(updatedCard._id) ? updatedCard : c))
    );
  };

  const sessionId = String(session._id);

  return (
    <div>
      {/* Session Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            {session.title}
          </h2>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {session.teamName && (
              <span className="text-muted small">
                <i className="bi bi-people me-1"></i>
                {session.teamName}
              </span>
            )}
            <span
              className={
                session.status === "active"
                  ? "status-badge-active"
                  : "status-badge-closed"
              }
            >
              {session.status === "active" ? "Aktif" : "Kapalı"}
            </span>
            <span className="text-muted small">
              <i className="bi bi-card-text me-1"></i>
              {cards.length} kart
            </span>
          </div>
          {session.description && (
            <p className="text-muted small mt-1 mb-0">{session.description}</p>
          )}
        </div>
      </div>

      {/* Board Columns */}
      <div className="row g-3">
        {COLUMNS.map((col) => (
          <div key={col.category} className="col-md-6 col-xl-3">
            <CardColumn
              category={col.category}
              label={col.label}
              icon={col.icon}
              headerClass={col.headerClass}
              cards={cards.filter((c) => c.category === col.category)}
              sessionStatus={session.status}
              onAddCard={() => handleAddCard(col.category)}
              onCardDeleted={handleCardDeleted}
              onCardVoted={handleCardVoted}
            />
          </div>
        ))}
      </div>

      {/* Add Card Modal */}
      {showModal && (
        <AddCardModal
          sessionId={sessionId}
          defaultCategory={selectedCategory}
          onClose={() => setShowModal(false)}
          onCardAdded={handleCardAdded}
        />
      )}
    </div>
  );
}
