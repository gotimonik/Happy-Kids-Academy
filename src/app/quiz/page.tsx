import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quiz" }]} />
      <MixedQuizClient />
    </PageContainer>
  );
}
