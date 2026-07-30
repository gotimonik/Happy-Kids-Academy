import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { SettingsPanel } from "@/features/settings/settings-panel";

export const metadata: Metadata = {
  title: "Settings",
  description: "Language, voice, and music settings.",
  alternates: { canonical: "/settings" },
};

export default function SettingsPage() {
  return (
    <PageContainer>
      <SettingsPanel />
    </PageContainer>
  );
}
