"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { selectTotalStars, useProgressStore } from "@/store/progress-store";

export function StarsPill({ className }: { className?: string }) {
  const totalStars = useProgressStore(selectTotalStars);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm",
        className,
      )}
    >
      <Star className="size-4 fill-current" aria-hidden="true" />
      <span aria-live="polite">{totalStars} stars</span>
    </div>
  );
}
