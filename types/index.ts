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
