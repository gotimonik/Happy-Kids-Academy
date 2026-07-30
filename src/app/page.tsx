import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { CategoryGrid } from "@/features/home/category-grid";
import { HomeHero } from "@/features/home/home-hero";
import { websiteJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  description:
    "Explore alphabet, numbers, math, shapes, colors, animals, Gujarati, and Hindi through playful lessons, quizzes, and games for young children.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <JsonLd data={websiteJsonLd()} />
      <HomeHero />
      <CategoryGrid />
    </div>
  );
}
