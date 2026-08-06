"use client";

import { cn } from "@/lib/utils";

export interface SegmentedToggleOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

/**
 * A small 2+ option pill switcher, styled to sit on top of a colorful
 * gradient hero (translucent white track; the active option becomes a
 * solid white pill in the hero's own accent color).
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  color,
  "aria-label": ariaLabel,
}: {
  options: readonly SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  color: string;
  "aria-label": string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex gap-1 rounded-full bg-white/20 p-1 backdrop-blur-sm"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
              isActive ? "bg-white shadow-sm" : "text-white/85 hover:text-white",
            )}
            style={isActive ? { color } : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
