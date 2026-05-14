export type CardCategory = "went_well" | "to_improve" | "action_item" | "kudos";

export interface Session {
  _id: string;
  title: string;
  description?: string;
  teamName?: string;
  status: "active" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  sessionId: string;
  category: CardCategory;
  content: string;
  author?: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

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

export const CARD_CATEGORIES: Record<
  CardCategory,
  { label: string; color: string; icon: string }
> = {
  went_well: {
    label: "İyi Giden",
    color: "category-went-well",
    icon: "bi-hand-thumbs-up",
  },
  to_improve: {
    label: "Geliştirilecek",
    color: "category-to-improve",
    icon: "bi-arrow-up-circle",
  },
  action_item: {
    label: "Aksiyon",
    color: "category-action",
    icon: "bi-lightning",
  },
  kudos: {
    label: "Tebrik",
    color: "category-kudos",
    icon: "bi-star",
  },
};
