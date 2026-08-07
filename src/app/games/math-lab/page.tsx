import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { MathLabGame } from "@/features/games/math-lab/math-lab-game";

export const metadata: Metadata = {
  title: "Visual Math Lab",
  description: "Watch numbered balls combine, split, group, and share to explain addition, subtraction, multiplication, and division.",
  alternates: { canonical: "/games/math-lab" },
};

export default function MathLabPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Visual Math Lab" }]} />
      <h1 className="text-center font-display text-2xl font-bold">Visual Math Lab</h1>
      <MathLabGame />
    </PageContainer>
  );
}
