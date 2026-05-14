import mongoose, { Schema, Document, Model } from "mongoose";

export type CardCategory = "went_well" | "to_improve" | "action_item" | "kudos";

export interface ICard extends Document {
  sessionId: mongoose.Types.ObjectId;
  category: CardCategory;
  content: string;
  author?: string;
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
    category: {
      type: String,
      enum: ["went_well", "to_improve", "action_item", "kudos"],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;
