import type { Metadata } from "next";
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
      <GradeQuizClient
        title="Missing Number"
        accentColor="#45AAF2"
        gameId="missing-number"
        recordAgainstCategory="numbers"
      />
    </PageContainer>
  );
}
