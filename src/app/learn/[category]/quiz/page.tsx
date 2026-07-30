import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategorySlugs, getCategory } from "@/data/categories";
import { PageContainer } from "@/components/shared/page-container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryQuizClient } from "@/features/quiz/category-quiz-client";

interface QuizPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: `${category.title} Quiz`, alternates: { canonical: `/learn/${category.slug}/quiz` } };
}

export default async function CategoryQuizPage({ params }: QuizPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.title, href: `/learn/${category.slug}` },
          { label: "Quiz" },
        ]}
      />
      <CategoryQuizClient category={category} />
    </PageContainer>
  );
}
