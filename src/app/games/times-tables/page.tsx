import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/shared/page-container";
import { TimesTablesPageContent } from "@/features/games/times-tables/times-tables-page-content";

export const metadata: Metadata = {
  title: "Times Tables",
  description: "Learn multiplication tables one number at a time, then practice — a single table or all mixed together.",
  alternates: { canonical: "/games/times-tables" },
};

export default function TimesTablesPage() {
  return (
    <PageContainer>
      <Suspense fallback={null}>
        <TimesTablesPageContent />
      </Suspense>
    </PageContainer>
  );
}
