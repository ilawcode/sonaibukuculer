import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import Card from "@/models/Card";
import { notFound } from "next/navigation";
import RetroBoard from "@/components/RetroBoard";
import { ISession } from "@/models/Session";
import { ICard } from "@/models/Card";

interface PageProps {
  params: { id: string };
}

async function getSessionData(id: string) {
  await connectDB();

  const session = await Session.findById(id).lean();
  if (!session) return null;

  const cards = await Card.find({ sessionId: id })
    .sort({ votes: -1, createdAt: -1 })
    .lean();

  return {
    session: JSON.parse(JSON.stringify(session)) as ISession,
    cards:   JSON.parse(JSON.stringify(cards))   as ICard[],
  };
}

export default async function SessionDetailPage({ params }: PageProps) {
  const data = await getSessionData(params.id);
  if (!data) notFound();
  return <RetroBoard session={data.session} initialCards={data.cards} />;
}
