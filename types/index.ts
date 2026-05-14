// ─── Session ────────────────────────────────────────────
export type SessionStatus =
  | "created"
  | "waiting_participants"
  | "in_progress"
  | "review"
  | "action_planning"
  | "closed";

export const SESSION_STATUSES: Record<SessionStatus, { label: string; color: string; icon: string }> = {
  created:              { label: "Oluşturuldu",         color: "#f0e8fd", icon: "bi-plus-circle"         },
  waiting_participants: { label: "Katılımcı Bekleniyor", color: "#fff3cd", icon: "bi-hourglass"           },
  in_progress:          { label: "Devam Ediyor",         color: "#daf5ec", icon: "bi-play-circle"         },
  review:               { label: "İnceleme",             color: "#daeaf8", icon: "bi-eye"                 },
  action_planning:      { label: "Aksiyon Planlama",     color: "#fde8d8", icon: "bi-list-task"           },
  closed:               { label: "Kapalı",               color: "#e8e8f0", icon: "bi-lock"               },
};

export interface Session {
  _id: string;
  title: string;
  description?: string;
  teamName?: string;
  createdBy?: string;
  retroKey: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── User ────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Participant ─────────────────────────────────────────
export interface Participant {
  _id: string;
  sessionId: string;
  name: string;
  email?: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Card ────────────────────────────────────────────────
export type CardType = "positive" | "negative" | "kudos";

export const CARD_TYPES: Record<CardType, { label: string; colorClass: string; icon: string; description: string }> = {
  positive: {
    label:       "İyi Giden",
    colorClass:  "card-type-positive",
    icon:        "bi-hand-thumbs-up",
    description: "Sprint boyunca iyi giden şeyler",
  },
  negative: {
    label:       "Geliştirilecek",
    colorClass:  "card-type-negative",
    icon:        "bi-arrow-up-circle",
    description: "İyileştirme fırsatları",
  },
  kudos: {
    label:       "Tebrik",
    colorClass:  "card-type-kudos",
    icon:        "bi-star",
    description: "Takım üyelerini takdir et",
  },
};

export interface Card {
  _id: string;
  sessionId: string;
  type: CardType;
  content: string;
  participantId?: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Action ──────────────────────────────────────────────
export type ActionStatus = "open" | "in_progress" | "done";

export const ACTION_STATUSES: Record<ActionStatus, { label: string; color: string; icon: string }> = {
  open:        { label: "Açık",        color: "#daeaf8", icon: "bi-circle"          },
  in_progress: { label: "Devam Ediyor", color: "#f8eada", icon: "bi-arrow-repeat"   },
  done:        { label: "Tamamlandı",  color: "#daf5ec", icon: "bi-check-circle"    },
};

export interface Action {
  _id: string;
  sessionId: string;
  description: string;
  assigneeName?: string;
  assigneeEmail?: string;
  status: ActionStatus;
  dueDate?: string;
  mailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Generic ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
