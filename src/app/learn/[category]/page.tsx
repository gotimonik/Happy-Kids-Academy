import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, PenLine, Target } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { PageContainer } from "@/components/shared/page-container";
import { StaticLink as Link } from "@/components/shared/static-link";
import { getAllCategorySlugs, getCategory } from "@/data/categories";
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

      <header
        className="rounded-2xl p-6 text-white shadow-md sm:p-8"
        style={{ backgroundColor: category.color }}
      >
        <span aria-hidden="true" className="text-3xl">
          {category.icon}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{category.title}</h1>
        <p className="mt-1 text-white/85">{category.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/learn/${category.slug}/lesson`}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: category.color }}
          >
            <BookOpen className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display font-bold">Learn</span>
            <span className="block text-sm text-muted-foreground">
              Explore {category.items.length} cards
            </span>
          </span>
        </Link>

        <Link
          href={`/learn/${category.slug}/quiz`}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Target className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display font-bold">Play Quiz</span>
            <span className="block text-sm text-muted-foreground">10 fun questions</span>
          </span>
        </Link>

        {category.trace && (
          <Link
            href={`/learn/${category.slug}/practice`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring sm:col-span-2"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E17055] text-white">
              <PenLine className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display font-bold">Writing Practice</span>
              <span className="block text-sm text-muted-foreground">Trace and draw</span>
            </span>
          </Link>
        )}
      </div>
    </PageContainer>
  );
}
