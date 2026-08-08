"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A compact square icon button — small enough that a whole toolbar's worth
 * fit on screen at once, but still a comfortable tap target for small
 * fingers. Shared between the Drawing and Coloring games' toolbars so both
 * keep the same look as new tools get added to either one.
 */
export function ToolIconButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  tone = "default",
  role,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tone?: "default" | "destructive" | "success";
  role?: "radio";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === "radio" ? active : undefined}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 shadow-sm transition-transform focus-visible:outline-2 focus-visible:outline-ring active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        active
          ? "scale-105 border-foreground bg-foreground text-background"
          : tone === "destructive"
            ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
            : tone === "success"
              ? "border-success/30 bg-success/10 text-success hover:bg-success/20"
              : "border-border bg-card text-foreground hover:bg-secondary",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
