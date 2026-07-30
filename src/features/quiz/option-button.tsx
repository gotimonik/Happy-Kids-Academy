"use client";

import { cn } from "@/lib/utils";

export function OptionButton({
  label,
  onSelect,
  disabled,
  accentColor,
}: {
  label: string;
  onSelect: () => void;
  disabled: boolean;
  accentColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "min-h-16 w-full rounded-2xl border-2 bg-card px-5 py-4 text-lg font-bold shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-60",
      )}
      style={{ borderColor: accentColor }}
    >
      {label}
    </button>
  );
}
