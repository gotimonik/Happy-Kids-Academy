import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { RewardsDashboard } from "@/features/rewards/rewards-dashboard";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Track stars, coins, badges, and certificates earned.",
  alternates: { canonical: "/rewards" },
};

export default function RewardsPage() {
  return (
    <PageContainer>
      <RewardsDashboard />
    </PageContainer>
  );
}
