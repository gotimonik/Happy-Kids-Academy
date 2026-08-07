import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { GradeQuizClient } from "@/features/quiz/grade-quiz-client";

export const metadata: Metadata = {
  title: "Patterns",
  description: "Complete the number pattern.",
  alternates: { canonical: "/games/patterns" },
};

export default function PatternsPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Patterns" }]} />
      <GradeQuizClient
        title="Patterns"
        accentColor="#45AAF2"
        gameId="patterns"
        recordAgainstCategory="numbers"
      />
    </PageContainer>
  );
}
