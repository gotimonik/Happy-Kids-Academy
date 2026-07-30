import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { SpeedRoundGame } from "@/features/games/speed-round/speed-round-game";

export const metadata: Metadata = {
  title: "Speed Round",
  description: "Answer as many mixed questions as you can before the 60-second timer runs out.",
  alternates: { canonical: "/games/speed-round" },
};

export default function SpeedRoundPage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-bold">Speed Round</h1>
      <SpeedRoundGame />
    </PageContainer>
  );
}
