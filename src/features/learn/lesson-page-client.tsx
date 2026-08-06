"use client";

import { useRouter } from "next/navigation";
import { useDisplayCategory } from "@/lib/categories/use-display-category";
import type { LearningCategory } from "@/types/category";
import { LessonCarousel } from "./lesson-carousel";

export function LessonPageClient({ category }: { category: LearningCategory }) {
  const router = useRouter();
  const displayCategory = useDisplayCategory(category);
  return (
    <LessonCarousel category={displayCategory} onFinish={() => router.push(`/learn/${category.slug}`)} />
  );
}
