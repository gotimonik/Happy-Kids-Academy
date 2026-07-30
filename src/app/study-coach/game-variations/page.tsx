import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { GameVariationsClient } from "@/features/study-coach/game-variations-client";

export const metadata: Metadata = {
  title: "Game Variations",
  description: "Grade-adjusted difficulty rounds and household materials for the selected game.",
  alternates: { canonical: "/study-coach/game-variations" },
};

export default function GameVariationsPage() {
  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Study Coach", href: "/study-coach" },
          { label: "Game Variations" },
        ]}
      />
      <h1 className="font-display text-2xl font-bold">Game Variations</h1>
      <GameVariationsClient />
    </PageContainer>
  );
}
