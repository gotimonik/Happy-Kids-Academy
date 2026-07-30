import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";
import { DrawingGame } from "@/features/games/drawing/drawing-game";

export const metadata: Metadata = {
  title: "Drawing",
  description: "Free-draw anything you like on a blank canvas.",
  alternates: { canonical: "/games/drawing" },
};

export default function DrawingPage() {
  return (
    <PageContainer>
      <h1 className="text-center font-display text-2xl font-bold">Drawing</h1>
      <DrawingGame />
    </PageContainer>
  );
}
