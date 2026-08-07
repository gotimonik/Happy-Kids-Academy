import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { SimonPatternGame } from "@/features/games/simon-pattern/simon-pattern-game";

export const metadata: Metadata = {
  title: "Color Memory",
  description: "Watch the color pattern, then repeat it back — how many rounds can you remember?",
  alternates: { canonical: "/games/simon-pattern" },
};

export default function SimonPatternPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Color Memory" }]} />
      <h1 className="text-center font-display text-2xl font-bold">Color Memory</h1>
      <SimonPatternGame />
    </PageContainer>
  );
}
