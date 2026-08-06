"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  indicatorClassName?: string;
  /** Inline style merged onto the indicator — handy for a per-instance accent color. */
  indicatorStyle?: CSSProperties;
}

export function Progress({
  className,
  value,
  indicatorClassName,
  indicatorStyle,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full flex-1 rounded-full bg-primary transition-transform duration-500", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)`, ...indicatorStyle }}
      />
    </ProgressPrimitive.Root>
  );
}
