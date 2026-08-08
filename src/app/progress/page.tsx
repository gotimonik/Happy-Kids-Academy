import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/shared/page-container";
import { ProgressPageContent } from "@/features/rewards/progress-page-content";

export const metadata: Metadata = {
  title: "My Progress",
  description: "See the stars, coins, and badges a friend has earned playing Happy Kids Academy — and join in for free.",
  alternates: { canonical: "/progress" },
};

export default function ProgressPage() {
  return (
    <PageContainer>
      <Suspense fallback={null}>
        <ProgressPageContent />
      </Suspense>
    </PageContainer>
  );
}
