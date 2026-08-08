import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { DrawingGallery } from "@/features/games/drawing/drawing-gallery";

export const metadata: Metadata = {
  title: "My Drawings",
  description: "All the pictures you've saved from the Drawing game.",
  alternates: { canonical: "/games/drawing/gallery" },
};

export default function DrawingGalleryPage() {
  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: "Drawing", href: "/games/drawing" },
          { label: "My Drawings" },
        ]}
      />
      <h1 className="text-center font-display text-2xl font-bold">My Drawings</h1>
      <DrawingGallery />
    </PageContainer>
  );
}
