import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { GradeQuizClient } from "@/features/quiz/grade-quiz-client";

export const metadata: Metadata = {
  title: "Missing Number",
  description: "Fill in the missing number in a short counting sequence.",
  alternates: { canonical: "/games/missing-number" },
};

export default function MissingNumberPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Missing Number" }]} />
      <GradeQuizClient
        title="Missing Number"
        accentColor="#45AAF2"
        gameId="missing-number"
        recordAgainstCategory="numbers"
      />
    </PageContainer>
  );
}
