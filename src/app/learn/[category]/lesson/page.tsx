import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategorySlugs, getCategory } from "@/data/categories";
import { PageContainer } from "@/components/shared/page-container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { LessonPageClient } from "@/features/learn/lesson-page-client";

interface LessonPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: `Learn ${category.title}`, alternates: { canonical: `/learn/${category.slug}/lesson` } };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.title, href: `/learn/${category.slug}` },
          { label: "Learn" },
        ]}
      />
      <h1 className="sr-only">Learn {category.title}</h1>
      <LessonPageClient category={category} />
    </PageContainer>
  );
}
