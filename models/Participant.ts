import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParticipant extends Document {
  sessionId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Geçerli bir e-posta adresi girin"],
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Aynı kişi aynı oturuma bir kez katılabilir (email bazlı)
ParticipantSchema.index({ sessionId: 1, email: 1 }, { unique: true, sparse: true });

const Participant: Model<IParticipant> =
  mongoose.models.Participant ||
  mongoose.model<IParticipant>("Participant", ParticipantSchema);

export default Participant;
