import mongoose, { Schema, Document, Model } from "mongoose";

export type SessionStatus =
  | "created"
  | "waiting_participants"
  | "in_progress"
  | "review"
  | "action_planning"
  | "closed";

export const STATUS_TRANSITIONS: Record<SessionStatus, SessionStatus | null> = {
  created: "waiting_participants",
  waiting_participants: "in_progress",
  in_progress: "review",
  review: "action_planning",
  action_planning: "closed",
  closed: null,
};

export interface ISession extends Document {
  title: string;
  description?: string;
  teamName?: string;
  createdBy?: string;
  retroKey: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

function generateRetroKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let key = "LEAN-";
  for (let i = 0; i < 6; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

const SessionSchema = new Schema<ISession>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    teamName: { type: String, trim: true },
    createdBy: { type: String, trim: true },
    retroKey: {
      type: String,
      unique: true,
      default: generateRetroKey,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["created", "waiting_participants", "in_progress", "review", "action_planning", "closed"],
      default: "created",
    },
  },
  { timestamps: true }
);

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;
