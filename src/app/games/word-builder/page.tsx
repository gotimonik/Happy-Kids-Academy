import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { GradeQuizClient } from "@/features/quiz/grade-quiz-client";

export const metadata: Metadata = {
  title: "Word Builder",
  description: "Pick the word that starts with the given letter.",
  alternates: { canonical: "/games/word-builder" },
};

export default function WordBuilderPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Word Builder" }]} />
      <GradeQuizClient
        title="Word Builder"
        accentColor="#FF707D"
        gameId="word-builder"
        recordAgainstCategory="alphabet"
      />
    </PageContainer>
  );
}
