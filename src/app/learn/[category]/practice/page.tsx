import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategorySlugs, getCategory } from "@/data/categories";
import { PageContainer } from "@/components/shared/page-container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PracticePageClient } from "@/features/writing-practice/practice-page-client";

interface PracticePageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategorySlugs()
    .filter((slug) => getCategory(slug)?.trace)
    .map((category) => ({ category }));
}

export async function generateMetadata({ params }: PracticePageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.title} Writing Practice`,
    alternates: { canonical: `/learn/${category.slug}/practice` },
  };
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category || !category.trace) notFound();

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.title, href: `/learn/${category.slug}` },
          { label: "Writing Practice" },
        ]}
      />
      <h1 className="text-center font-display text-2xl font-bold">{category.title} Writing Practice</h1>
      <PracticePageClient category={category} />
    </PageContainer>
  );
}
