"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { selectTotalStars, useProgressStore } from "@/store/progress-store";

export function StarsPill({ className }: { className?: string }) {
  const totalStars = useProgressStore(selectTotalStars);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/20 px-2.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm",
        className,
      )}
    >
      <Star className="size-3.5 shrink-0 fill-current sm:size-4" aria-hidden="true" />
      <span aria-live="polite">
        {totalStars} <span className="hidden sm:inline">stars</span>
      </span>
    </div>
  );
}
