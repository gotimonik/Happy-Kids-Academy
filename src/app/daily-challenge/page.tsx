import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { DailyChallengeClient } from "@/features/daily-challenge/daily-challenge-client";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description: "A special 5-question challenge that's the same for everyone today, with a bonus coin reward.",
  alternates: { canonical: "/daily-challenge" },
};

export default function DailyChallengePage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Daily Challenge" }]} />
      <DailyChallengeClient />
    </PageContainer>
  );
}
