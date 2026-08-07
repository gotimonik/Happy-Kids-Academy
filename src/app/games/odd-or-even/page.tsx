import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { GradeQuizClient } from "@/features/quiz/grade-quiz-client";

export const metadata: Metadata = {
  title: "Odd or Even",
  description: "Decide whether each number is odd or even.",
  alternates: { canonical: "/games/odd-or-even" },
};

export default function OddOrEvenPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Odd or Even" }]} />
      <GradeQuizClient
        title="Odd or Even"
        accentColor="#45AAF2"
        gameId="odd-or-even"
        recordAgainstCategory="numbers"
      />
    </PageContainer>
  );
}
