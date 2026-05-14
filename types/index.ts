// ─── Session ────────────────────────────────────────────
export type SessionStatus =
  | "created"
  | "waiting_participants"
  | "in_progress"
  | "review"
  | "action_planning"
  | "closed";

export const SESSION_STATUSES: Record<SessionStatus, { label: string; color: string; icon: string }> = {
  created:              { label: "Oluşturuldu",          color: "#f0e8fd", icon: "bi-plus-circle"   },
  waiting_participants: { label: "Katılımcı Bekleniyor", color: "#fff3cd", icon: "bi-hourglass"     },
  in_progress:          { label: "Devam Ediyor",         color: "#daf5ec", icon: "bi-play-circle"   },
  review:               { label: "İnceleme",             color: "#daeaf8", icon: "bi-eye"           },
  action_planning:      { label: "Aksiyon Planlama",     color: "#fde8d8", icon: "bi-list-task"     },
  closed:               { label: "Kapalı",               color: "#e8e8f0", icon: "bi-lock"          },
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
    colorClass:  "category-went-well",
    icon:        "bi-hand-thumbs-up",
    description: "Sprint boyunca iyi giden şeyler",
  },
  negative: {
    label:       "Geliştirilecek",
    colorClass:  "category-to-improve",
    icon:        "bi-arrow-up-circle",
    description: "İyileştirme fırsatları",
  },
  kudos: {
    label:       "Tebrik",
    colorClass:  "category-kudos",
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
  open:        { label: "Açık",          color: "#daeaf8", icon: "bi-circle"       },
  in_progress: { label: "Devam Ediyor",  color: "#f8eada", icon: "bi-arrow-repeat" },
  done:        { label: "Tamamlandı",    color: "#daf5ec", icon: "bi-check-circle" },
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

// ─── Eski retrolar (frontend-only mock) ──────────────────
export type RetroStatus = "completed" | "in_progress" | "needs_action";
export type RetroActionPriority = "low" | "medium" | "high";
export type RetroActionStatus = "open" | "planned" | "in_progress" | "completed";

export interface RetroParticipant {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarInitials: string;
  attendanceStatus: "attended" | "late" | "absent";
}

export interface RetroInsightItem {
  id: string;
  content: string;
  votes?: number;
  tag?: string;
}

export interface RetroActionReminder {
  status: "not_sent" | "sent";
  lastSentAt?: string;
}

export interface RetroActionItem {
  id: string;
  title: string;
  description: string;
  priority: RetroActionPriority;
  status: RetroActionStatus;
  dueDate: string;
  createdAt: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeEmail?: string;
  reminder: RetroActionReminder;
}

export interface RetroSummary {
  id: string;
  key: string;
  title: string;
  teamName: string;
  date: string;
  participantCount: number;
  actionCount: number;
  status: RetroStatus;
}

export interface RetroDetail extends RetroSummary {
  summary: string;
  wentWell: RetroInsightItem[];
  wentWrong: RetroInsightItem[];
  participants: RetroParticipant[];
  actions: RetroActionItem[];
}

// ─── Eski CardCategory (geriye dönük uyumluluk) ──────────
export type CardCategory = "went_well" | "to_improve" | "action_item" | "kudos";

export const CARD_CATEGORIES: Record<CardCategory, { label: string; color: string; icon: string }> = {
  went_well:   { label: "İyi Giden",      color: "category-went-well",   icon: "bi-hand-thumbs-up"  },
  to_improve:  { label: "Geliştirilecek", color: "category-to-improve",  icon: "bi-arrow-up-circle" },
  action_item: { label: "Aksiyon",        color: "category-action",      icon: "bi-lightning"       },
  kudos:       { label: "Tebrik",         color: "category-kudos",       icon: "bi-star"            },
};
