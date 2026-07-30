import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { GradeQuizClient } from "@/features/quiz/grade-quiz-client";

export const metadata: Metadata = {
  title: "Times Tables",
  description: "Practice multiplication facts.",
  alternates: { canonical: "/games/times-tables" },
};

export default function TimesTablesPage() {
  return (
    <PageContainer>
      <GradeQuizClient
        title="Times Tables"
        accentColor="#37C183"
        gameId="times-tables"
        recordAgainstCategory="math"
      />
    </PageContainer>
  );
}
