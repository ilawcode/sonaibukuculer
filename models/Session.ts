import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  title: string;
  description?: string;
  teamName?: string;
  status: "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    teamName: { type: String, trim: true },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
);

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;
