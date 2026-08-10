"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A compact square icon button — small enough that a whole toolbar's worth
 * fit on screen at once, but still a comfortable tap target for small
 * fingers. Shared between the Drawing and Coloring games' toolbars so both
 * keep the same look as new tools get added to either one.
 *
 * Shares the "tactile" language `Button` uses app-wide (see
 * `buttonVariants`'s doc comment) at a smaller, toolbar-appropriate scale —
 * and reuses that same raised/pressed-in distinction to double as the
 * selected-state cue for the Pencil/Eraser-style `role="radio"` pairs: the
 * *unselected* tool sits raised on its little colored lip, ready to be
 * tapped, while the *selected* one already looks pressed in, which reads
 * naturally as "this one's the one currently on."
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
        "btn-tactile flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-all focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",
        active
          ? cn(
              "translate-y-[3px] shadow-none",
              tone === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : tone === "success"
                  ? "border-success bg-success text-success-foreground"
                  : "border-foreground bg-foreground text-background",
            )
          : cn(
              "hover:-translate-y-0.5 active:translate-y-[3px]",
              tone === "destructive"
                ? "border-destructive/30 bg-destructive/10 text-destructive shadow-[0_3px_0_0_color-mix(in_srgb,var(--destructive)_35%,var(--card)_65%)] hover:bg-destructive/20 active:shadow-none"
                : tone === "success"
                  ? "border-success/30 bg-success/10 text-success shadow-[0_3px_0_0_color-mix(in_srgb,var(--success)_35%,var(--card)_65%)] hover:bg-success/20 active:shadow-none"
                  : "border-border bg-card text-foreground shadow-[0_3px_0_0_color-mix(in_srgb,var(--border)_100%,black_6%)] hover:bg-secondary active:shadow-none",
            ),
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
