import mongoose, { Schema, Document, Model } from "mongoose";

export type ActionStatus = "open" | "in_progress" | "done";

export interface IAction extends Document {
  sessionId: mongoose.Types.ObjectId;
  description: string;
  assigneeName?: string;
  assigneeEmail?: string;
  status: ActionStatus;
  dueDate?: Date;
  mailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActionSchema = new Schema<IAction>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    description: { type: String, required: true, trim: true },
    assigneeName: { type: String, trim: true },
    assigneeEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Geçerli bir e-posta adresi girin"],
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "done"],
      default: "open",
    },
    dueDate: { type: Date },
    mailSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Action: Model<IAction> =
  mongoose.models.Action || mongoose.model<IAction>("Action", ActionSchema);

export default Action;
