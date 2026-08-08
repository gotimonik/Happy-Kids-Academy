import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";
import { ColoringGallery } from "@/features/games/coloring/coloring-gallery";

export const metadata: Metadata = {
  title: "My Colorings",
  description: "All the pictures you've saved from the Coloring game.",
  alternates: { canonical: "/games/coloring/gallery" },
};

export default function ColoringGalleryPage() {
  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: "Coloring", href: "/games/coloring" },
          { label: "My Colorings" },
        ]}
      />
      <h1 className="text-center font-display text-2xl font-bold">My Colorings</h1>
      <ColoringGallery />
    </PageContainer>
  );
}
