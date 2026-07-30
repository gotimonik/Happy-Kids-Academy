import type { BreadcrumbItem } from "@/components/shared/breadcrumbs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.example.com";
const SITE_NAME = "Happy Kids Academy";

/** `WebSite` structured data, rendered once on the root layout/home page. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games.",
  };
}

/** `BreadcrumbList` structured data matching the visible `<Breadcrumbs>` component. */
export function breadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };
}

/** `LearningResource` structured data for a category hub page. */
export function learningResourceJsonLd({
  name,
  description,
  slug,
  itemCount,
}: {
  name: string;
  description: string;
  slug: string;
  itemCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url: `${SITE_URL}/learn/${slug}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    educationalLevel: "Preschool",
    numberOfItems: itemCount,
  };
}
