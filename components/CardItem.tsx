"use client";

import { useState } from "react";
import { ICard } from "@/models/Card";

interface CardItemProps {
  card: ICard;
  sessionStatus: "active" | "closed";
  onDeleted: (cardId: string) => void;
  onVoted: (card: ICard) => void;
}

const CATEGORY_CLASSES: Record<string, string> = {
  went_well: "category-went-well",
  to_improve: "category-to-improve",
  action_item: "category-action",
  kudos: "category-kudos",
};

export default function CardItem({
  card,
  sessionStatus,
  onDeleted,
  onVoted,
}: CardItemProps) {
  const [voting, setVoting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cardId = String(card._id);

  const handleVote = async () => {
    setVoting(true);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        onVoted(data.data);
      }
    } catch (err) {
      console.error("Vote error:", err);
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu kartı silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onDeleted(cardId);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`p-3 rounded-3 ${CATEGORY_CLASSES[card.category]}`}
      style={{ fontSize: "0.9rem" }}
    >
      <p className="mb-2" style={{ color: "var(--text-main)", lineHeight: 1.5 }}>
        {card.content}
      </p>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {card.author && (
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              <i className="bi bi-person me-1"></i>
              {card.author}
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-1">
          {/* Vote Button */}
          <button
            className="vote-btn d-flex align-items-center gap-1"
            onClick={handleVote}
            disabled={voting}
            title="Oy ver"
          >
            <i className="bi bi-heart-fill" style={{ fontSize: "0.7rem", color: "#d47aaa" }}></i>
            <span>{card.votes}</span>
          </button>

          {/* Delete Button */}
          {sessionStatus === "active" && (
            <button
              className="vote-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Sil"
              style={{ color: "#c0392b" }}
            >
              {deleting ? (
                <span
                  className="spinner-border spinner-border-sm"
                  style={{ width: 10, height: 10 }}
                ></span>
              ) : (
                <i className="bi bi-trash3" style={{ fontSize: "0.75rem" }}></i>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
