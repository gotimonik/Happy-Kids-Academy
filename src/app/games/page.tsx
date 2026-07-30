import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { GAME_REGISTRY } from "@/features/games/game-registry";
import { GameTile } from "@/features/games/game-tile";

export const metadata: Metadata = {
  title: "Games",
  description: "Playful mini games: Balloon Pop, Matching, Visual Math Lab, and more.",
  alternates: { canonical: "/games" },
};

export default function GamesHubPage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-bold">Mini Games</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GAME_REGISTRY.map((game) => (
          <GameTile key={game.id} game={game} />
        ))}
      </div>
    </PageContainer>
  );
}
