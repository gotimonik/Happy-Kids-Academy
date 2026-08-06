import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { PageContainer } from "@/components/shared/page-container";
import { getAllCategorySlugs, getCategory } from "@/data/categories";
import { CategoryHub } from "@/features/learn/category-hub";
import { breadcrumbJsonLd, learningResourceJsonLd } from "@/lib/seo/json-ld";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.title,
    description: `${category.subtitle}. Learn ${category.title.toLowerCase()} with playful flashcards, quizzes, and games for kids.`,
    alternates: { canonical: `/learn/${category.slug}` },
  };
}

export default async function CategoryHubPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <PageContainer>
      <JsonLd
        data={learningResourceJsonLd({
          name: category.title,
          description: category.subtitle,
          slug: category.slug,
          itemCount: category.items.length,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: category.title },
        ])}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.title }]} />

      <CategoryHub category={category} />
    </PageContainer>
  );
}
