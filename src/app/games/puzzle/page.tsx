import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { PuzzleGame } from "@/features/games/puzzle/puzzle-game";

export const metadata: Metadata = {
  title: "Puzzle",
  description: "Put the shuffled numbers back in order.",
  alternates: { canonical: "/games/puzzle" },
};

export default function PuzzlePage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-bold">Puzzle</h1>
      <PuzzleGame />
    </PageContainer>
  );
}
