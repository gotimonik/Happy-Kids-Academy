"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { LearningCategory } from "@/types/category";
import { useProgressStore } from "@/store/progress-store";

export function CategoryTile({ category }: { category: LearningCategory }) {
  const stars = useProgressStore((state) => state.starsByCategory[category.slug] ?? 0);

  return (
    <Link
      href={`/learn/${category.slug}`}
      className="group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:min-h-36"
      style={{ backgroundColor: category.color }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-4 -top-6 size-20 rounded-full bg-white/15 transition-transform group-hover:scale-110"
      />
      <div className="relative flex items-start justify-between">
        <span aria-hidden="true" className="text-2xl font-black leading-none drop-shadow-sm">
          {category.icon}
        </span>
        {stars > 0 && (
          <span className="flex items-center gap-0.5 rounded-full bg-black/15 px-2 py-0.5 text-xs font-bold">
            <Star className="size-3 fill-current" aria-hidden="true" />
            {stars}
          </span>
        )}
      </div>
      <div className="relative">
        <p className="font-display text-base font-bold leading-tight sm:text-lg">{category.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/85">{category.subtitle}</p>
      </div>
    </Link>
  );
}
