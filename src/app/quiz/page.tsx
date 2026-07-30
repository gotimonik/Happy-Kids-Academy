import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { MixedQuizClient } from "@/features/quiz/mixed-quiz-client";

export const metadata: Metadata = {
  title: "Mixed Quiz",
  description: "A mixed quiz drawing questions from every learning category.",
  alternates: { canonical: "/quiz" },
};

export default function MixedQuizPage() {
  return (
    <PageContainer>
      <MixedQuizClient />
    </PageContainer>
  );
}
