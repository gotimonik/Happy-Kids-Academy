import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { MatchingGame } from "@/features/games/matching/matching-game";

export const metadata: Metadata = {
  title: "Matching Game",
  description: "Match letters, numbers, shapes, and fruits to their pictures or names.",
  alternates: { canonical: "/games/matching" },
};

export default function MatchingPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Matching Game" }]} />
      <MatchingGame />
    </PageContainer>
  );
}
