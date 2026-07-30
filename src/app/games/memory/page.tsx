import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { MemoryGame } from "@/features/games/memory/memory-game";

export const metadata: Metadata = {
  title: "Memory Game",
  description: "Flip cards and find every matching pair of animals.",
  alternates: { canonical: "/games/memory" },
};

export default function MemoryPage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-bold">Memory Game</h1>
      <MemoryGame />
    </PageContainer>
  );
}
