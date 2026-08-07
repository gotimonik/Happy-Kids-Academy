import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { SortingGame } from "@/features/games/drag-and-drop/sorting-game";

export const metadata: Metadata = {
  title: "Drag and Drop",
  description: "Sort animals and vehicles into the correct bucket.",
  alternates: { canonical: "/games/drag-and-drop" },
};

export default function DragAndDropPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Drag and Drop" }]} />
      <h1 className="font-display text-2xl font-bold">Drag and Drop</h1>
      <SortingGame />
    </PageContainer>
  );
}
