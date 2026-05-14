import { notFound } from "next/navigation";
import RetroHistoryDetail from "@/components/RetroHistoryDetail";
import { findRetroById } from "@/lib/mockRetros";

interface PageProps {
  params: {
    id: string;
  };
}

export default function RetroDetailPage({ params }: PageProps) {
  const retro = findRetroById(params.id);

  if (!retro) {
    notFound();
  }

  return <RetroHistoryDetail retro={retro} />;
}