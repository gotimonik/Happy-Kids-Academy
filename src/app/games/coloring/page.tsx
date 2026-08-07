import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { ColoringGame } from "@/features/games/coloring/coloring-game";

export const metadata: Metadata = {
  title: "Coloring",
  description: "Pick a color and fill in a house, tree, and sun picture.",
  alternates: { canonical: "/games/coloring" },
};

export default function ColoringPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Coloring" }]} />
      <h1 className="text-center font-display text-2xl font-bold">Coloring</h1>
      <ColoringGame />
    </PageContainer>
  );
}
