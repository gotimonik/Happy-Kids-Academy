import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { CoachHub } from "@/features/study-coach/coach-hub";

export const metadata: Metadata = {
  title: "Study Coach",
  description: "Grade-adjusted game variations, a treasure hunt, and a daily 30-minute routine.",
  alternates: { canonical: "/study-coach" },
};

export default function StudyCoachPage() {
  return (
    <PageContainer>
      <CoachHub />
    </PageContainer>
  );
}
