import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { SoundSafariGame } from "@/features/games/sound-safari/sound-safari-game";

export const metadata: Metadata = {
  title: "Sound Safari",
  description: "Listen to an animal sound and tap the animal that makes it.",
  alternates: { canonical: "/games/sound-safari" },
};

export default function SoundSafariPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Sound Safari" }]} />
      <h1 className="text-center font-display text-2xl font-bold">Sound Safari</h1>
      <SoundSafariGame />
    </PageContainer>
  );
}
