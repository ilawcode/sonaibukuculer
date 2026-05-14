"use client";

import { useState } from "react";
import { ICard } from "@/models/Card";

interface CardItemProps {
  card: ICard;
  canEdit: boolean;
  onDeleted: (cardId: string) => void;
  onVoted: (card: ICard) => void;
}

const TYPE_CLASSES: Record<string, string> = {
  positive: "category-went-well",
  negative: "category-to-improve",
  kudos:    "category-kudos",
};

export default function CardItem({ card, canEdit, onDeleted, onVoted }: CardItemProps) {
  const [voting,   setVoting]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cardId = String(card._id);

  const handleVote = async () => {
    setVoting(true);
    try {
      // Doğru vote endpoint: POST /api/cards/:id/vote
      const res  = await fetch(`/api/cards/${cardId}/vote`, { method: "POST" });
      const data = await res.json();
      if (data.success) onVoted(data.data);
    } catch (err) { console.error("Vote error:", err); }
    finally { setVoting(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Bu kartı silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      const res  = await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) onDeleted(cardId);
    } catch (err) { console.error("Delete error:", err); }
    finally { setDeleting(false); }
  };

  return (
    <div className={`p-3 rounded-3 ${TYPE_CLASSES[card.type] ?? "category-went-well"}`} style={{ fontSize: "0.9rem" }}>
      <p className="mb-2" style={{ color: "var(--text-main)", lineHeight: 1.5 }}>{card.content}</p>

      <div className="d-flex align-items-center justify-content-end gap-1">
        {/* Vote */}
        <button className="vote-btn d-flex align-items-center gap-1" onClick={handleVote} disabled={voting} title="Oy ver">
          <i className="bi bi-heart-fill" style={{ fontSize: "0.7rem", color: "#d47aaa" }}></i>
          <span>{card.votes}</span>
        </button>

        {/* Delete */}
        {canEdit && (
          <button className="vote-btn" onClick={handleDelete} disabled={deleting} title="Sil" style={{ color: "#c0392b" }}>
            {deleting
              ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }}></span>
              : <i className="bi bi-trash3" style={{ fontSize: "0.75rem" }}></i>}
          </button>
        )}
      </div>
    </div>
  );
}
