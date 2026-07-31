"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { tileGradient } from "@/lib/ui/tile-gradient";
import type { LearningCategory } from "@/types/category";
import { useProgressStore } from "@/store/progress-store";

export function CategoryTile({ category }: { category: LearningCategory }) {
  const stars = useProgressStore((state) => state.starsByCategory[category.slug] ?? 0);

  return (
    <Link
      href={`/learn/${category.slug}`}
      className="group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:min-h-36"
      style={tileGradient(category.color)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute -right-5 -top-7 size-24 rounded-full bg-white/15 transition-transform group-hover:scale-110"
      />
      <span aria-hidden="true" className="absolute -left-6 -bottom-8 size-24 rounded-full bg-black/10 blur-md" />
      <div className="relative flex items-start justify-between">
        <span aria-hidden="true" className="text-[3rem] font-black leading-none drop-shadow-sm">
          {category.icon}
        </span>
        {stars > 0 && (
          <span className="flex items-center gap-0.5 rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold backdrop-blur-sm">
            <Star className="size-3 fill-current" aria-hidden="true" />
            {stars}
          </span>
        )}
      </div>
      <div className="relative">
        <p className="font-display text-lg font-bold leading-tight drop-shadow-sm sm:text-xl">{category.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/85">{category.subtitle}</p>
      </div>
    </Link>
  );
}
