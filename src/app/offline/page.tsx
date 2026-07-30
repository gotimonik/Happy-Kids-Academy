import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <PageContainer>
      <EmptyState
        icon="📴"
        title="You're offline"
        description="No connection right now, but anything you've already opened still works, and your stars, coins, and progress are saved on this device."
      />
    </PageContainer>
  );
}
