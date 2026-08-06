"use client";

import { useMemo, useRef, useState } from "react";
import { Eraser, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDisplayCategory } from "@/lib/categories/use-display-category";
import type { LearningCategory } from "@/types/category";
import { TraceCanvas, type TraceCanvasHandle } from "./trace-canvas";

export function PracticePageClient({ category }: { category: LearningCategory }) {
  const displayCategory = useDisplayCategory(category);
  const guides = useMemo(
    () => displayCategory.items.filter((item) => Boolean(item.symbol)),
    [displayCategory.items],
  );
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<TraceCanvasHandle | null>(null);

  const currentGuide = guides[index % guides.length];
  const guideText = currentGuide?.symbol ?? category.icon;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-sm text-muted-foreground">
        Trace the letter with your mouse, finger, or stylus.
      </p>

      <TraceCanvas key={index} ref={canvasRef} guideText={guideText} strokeColor={category.color} />

      <div className="flex justify-center gap-3">
        <Button type="button" variant="outline" size="kid" onClick={() => canvasRef.current?.clear()}>
          <Eraser className="size-5" aria-hidden="true" />
          Clear
        </Button>
        <Button
          type="button"
          size="kid"
          style={{ backgroundColor: category.color }}
          className="text-white hover:brightness-110"
          onClick={() => setIndex((i) => (i + 1) % guides.length)}
        >
          <RefreshCw className="size-5" aria-hidden="true" />
          Next Guide
        </Button>
      </div>
    </div>
  );
}
