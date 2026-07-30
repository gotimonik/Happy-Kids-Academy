"use client";

import { useRouter } from "next/navigation";
import type { LearningCategory } from "@/types/category";
import { LessonCarousel } from "./lesson-carousel";

export function LessonPageClient({ category }: { category: LearningCategory }) {
  const router = useRouter();
  return (
    <LessonCarousel category={category} onFinish={() => router.push(`/learn/${category.slug}`)} />
  );
}
