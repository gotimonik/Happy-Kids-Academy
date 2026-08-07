import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { BalloonPopGame } from "@/features/games/balloon-pop/balloon-pop-game";

export const metadata: Metadata = {
  title: "Balloon Pop",
  description: "Pop the balloon showing the target letter.",
  alternates: { canonical: "/games/balloon-pop" },
};

export default function BalloonPopPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Balloon Pop" }]} />
      <h1 className="font-display text-2xl font-bold">Balloon Pop</h1>
      <BalloonPopGame />
    </PageContainer>
  );
}
