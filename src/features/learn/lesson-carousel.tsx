"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/store/progress-store";
import type { LearningCategory } from "@/types/category";
import { FlashCard } from "./flash-card";

export function LessonCarousel({
  category,
  onFinish,
}: {
  category: LearningCategory;
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const incrementLessonsCompleted = useProgressStore((state) => state.incrementLessonsCompleted);
  const total = category.items.length;
  const item = category.items[index];

  const goNext = useCallback(() => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      incrementLessonsCompleted();
      onFinish();
    }
  }, [index, total, incrementLessonsCompleted, onFinish]);

  const goBack = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goBack]);

  if (!item) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Progress value={((index + 1) / total) * 100} className="flex-1" />
        <span className="shrink-0 text-sm font-bold text-muted-foreground">
          {index + 1} / {total}
        </span>
      </div>

      <FlashCard item={item} accentColor={category.color} />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="kid"
          className="flex-1"
          onClick={goBack}
          disabled={index === 0}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          Back
        </Button>
        <Button
          type="button"
          size="kid"
          className="flex-1"
          style={{ backgroundColor: category.color }}
          onClick={goNext}
        >
          {index < total - 1 ? "Next" : "Finish"}
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
