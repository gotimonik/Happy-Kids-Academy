"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  indicatorClassName?: string;
  /** Inline style merged onto the indicator — handy for a per-instance accent color. */
  indicatorStyle?: CSSProperties;
  /**
   * Overrides the tooltip's content — defaults to the rounded percentage.
   * Pass a richer node (e.g. a "just scored" message with stars) for a
   * moment that deserves more than a bare number.
   */
  tooltipContent?: ReactNode;
  /**
   * Forces the tooltip open or closed instead of leaving it to hover —
   * e.g. flashing a result the instant it's earned, on a touch device
   * where nothing is ever "hovered". Omit to get plain hover-to-reveal
   * behavior (the common case).
   */
  tooltipOpen?: boolean;
}

/**
 * A plain progress bar that reveals its exact percentage on hover, instead
 * of every page having to spell one out in its own adjacent text (a "6 of
 * 26", a "23% traced", ...). Keeping that detail in a tooltip rather than
 * permanently on-screen is what makes this safe to drop in anywhere a bare
 * progress indicator is wanted — no reserved space for a label that may or
 * may not have anything to say, and (since a tooltip renders in a portal,
 * entirely outside normal document flow) nothing around it ever has to
 * shift to make room for it appearing or disappearing.
 */
export function Progress({
  className,
  value,
  indicatorClassName,
  indicatorStyle,
  tooltipContent,
  tooltipOpen,
  ...props
}: ProgressProps) {
  const bar = (
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

  if (value === undefined) return bar;

  return (
    <TooltipProvider>
      {/*
        `open` is only passed when the caller actually wants to force it —
        leaving it `undefined` keeps the tooltip fully uncontrolled (plain
        hover), whereas passing a real boolean here permanently would make
        every Progress bar's hover stop working the moment a caller never
        opts into `tooltipOpen` at all.
      */}
      <Tooltip {...(tooltipOpen === undefined ? {} : { open: tooltipOpen })}>
        <TooltipTrigger asChild>{bar}</TooltipTrigger>
        <TooltipContent>{tooltipContent ?? `${Math.round(value)}%`}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
