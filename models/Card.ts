import mongoose, { Schema, Document, Model } from "mongoose";

// positive → iyi giden
// negative → kötü giden / geliştirilecek
// kudos    → tebrik
export type CardType = "positive" | "negative" | "kudos";

export interface ICard extends Document {
  sessionId: mongoose.Types.ObjectId;
  type: CardType;
  content: string;
  // Anonim giriş: author kaydedilmez, sadece participantId opsiyonel
  participantId?: mongoose.Types.ObjectId;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    type: {
      type: String,
      enum: ["positive", "negative", "kudos"],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    // Anonim: author alanı yok, participantId opsiyonel
    participantId: {
      type: Schema.Types.ObjectId,
      ref: "Participant",
      default: null,
    },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;
