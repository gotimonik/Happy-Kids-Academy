import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { ParentDashboard } from "@/features/parent-dashboard/parent-dashboard";

export const metadata: Metadata = {
  title: "Parent Progress",
  description: "A summary of your child's learning time, lessons, and quiz scores.",
  alternates: { canonical: "/parents" },
};

export default function ParentProgressPage() {
  return (
    <PageContainer>
      <ParentDashboard />
    </PageContainer>
  );
}
