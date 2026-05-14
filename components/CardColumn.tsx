"use client";

import { ICard } from "@/models/Card";
import { CardType } from "@/types";
import CardItem from "@/components/CardItem";

interface CardColumnProps {
  type: CardType;
  label: string;
  icon: string;
  headerClass: string;
  cards: ICard[];
  canEdit: boolean;
  onAddCard: () => void;
  onCardDeleted: (cardId: string) => void;
  onCardVoted: (card: ICard) => void;
}

export default function CardColumn({
  label,
  icon,
  headerClass,
  cards,
  canEdit,
  onAddCard,
  onCardDeleted,
  onCardVoted,
}: CardColumnProps) {
  return (
    <div className="rounded-3 overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
      {/* Header */}
      <div className={`column-header d-flex align-items-center justify-content-between ${headerClass}`}>
        <span>
          <i className={`bi ${icon} me-2`}></i>
          {label}
        </span>
        <span className="badge rounded-pill bg-white bg-opacity-50" style={{ color: "inherit", fontSize: "0.75rem" }}>
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="p-2" style={{ background: "var(--bg-main)", minHeight: 200 }}>
        {cards.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            <i className="bi bi-inbox d-block fs-4 mb-1 opacity-50"></i>
            Henüz kart yok
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {cards.map(card => (
              <CardItem
                key={String(card._id)}
                card={card}
                canEdit={canEdit}
                onDeleted={onCardDeleted}
                onVoted={onCardVoted}
              />
            ))}
          </div>
        )}

        {canEdit && (
          <button
            className="btn w-100 mt-2 text-muted small"
            style={{ border: "1px dashed var(--border-color)", borderRadius: 8, background: "transparent" }}
            onClick={onAddCard}
          >
            <i className="bi bi-plus me-1"></i>Kart Ekle
          </button>
        )}
      </div>
    </div>
  );
}
