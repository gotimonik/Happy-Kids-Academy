import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { TreasureHuntClient } from "@/features/study-coach/treasure-hunt-client";

export const metadata: Metadata = {
  title: "Treasure Hunt",
  description: "A 10-question multilingual treasure hunt with an answer key.",
  alternates: { canonical: "/study-coach/treasure-hunt" },
};

export default function TreasureHuntPage() {
  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Study Coach", href: "/study-coach" },
          { label: "Treasure Hunt" },
        ]}
      />
      <h1 className="font-display text-2xl font-bold">Treasure Hunt</h1>
      <TreasureHuntClient />
    </PageContainer>
  );
}
