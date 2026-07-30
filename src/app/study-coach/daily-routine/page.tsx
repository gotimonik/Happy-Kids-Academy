import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { GuideList } from "@/features/study-coach/guide-list";
import { dailyRoutineEntries } from "@/lib/study-coach/guide-content";

export const metadata: Metadata = {
  title: "Daily 30-Minute Routine",
  description: "A daily routine made from three short 10-minute learning micro-games.",
  alternates: { canonical: "/study-coach/daily-routine" },
};

export default function DailyRoutinePage() {
  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Study Coach", href: "/study-coach" },
          { label: "Daily Routine" },
        ]}
      />
      <h1 className="font-display text-2xl font-bold">30-Minute Daily Routine</h1>
      <GuideList entries={dailyRoutineEntries()} accentColor="#0984E3" />
    </PageContainer>
  );
}
