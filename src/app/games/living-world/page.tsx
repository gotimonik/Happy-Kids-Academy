import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { LivingWorldGame } from "@/features/games/living-world/living-world-game";

export const metadata: Metadata = {
  title: "Living World",
  description: "Change day, night, and weather, and watch a small cast of animals react.",
  alternates: { canonical: "/games/living-world" },
};

export default function LivingWorldPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Living World" }]} />
      <h1 className="text-center font-display text-2xl font-bold">Living World</h1>
      <LivingWorldGame />
    </PageContainer>
  );
}
