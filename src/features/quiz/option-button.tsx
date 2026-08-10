"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type OptionState = "idle" | "correct" | "incorrect" | "dim";

const LETTERS = ["A", "B", "C", "D"];

/**
 * Pass a `key` that changes every round (e.g. `key={`${round}-${label}`}`) so
 * this remounts per question and the entrance stagger replays each time.
 */
export function OptionButton({
  label,
  onSelect,
  disabled,
  accentColor,
  state = "idle",
  index,
}: {
  label: string;
  onSelect: () => void;
  disabled: boolean;
  accentColor: string;
  /** "idle" while answering; "correct"/"incorrect"/"dim" once the round resolves. */
  state?: OptionState;
  /** Position in the option list — drives the A/B/C badge and entrance stagger. */
  index: number;
}) {
  const letter = LETTERS[index] ?? "";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      initial={{ opacity: 0, y: 12 }}
      animate={
        state === "incorrect"
          ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }
          : { opacity: state === "dim" ? 0.45 : 1, y: 0, x: 0 }
      }
      transition={{
        y: { duration: 0.3, delay: index * 0.06, ease: "easeOut" },
        opacity: { duration: 0.3, delay: index * 0.06 },
        x: { duration: 0.4, ease: "easeInOut" },
      }}
      whileHover={state === "idle" ? { y: -2, scale: 1.01 } : undefined}
      whileTap={state === "idle" ? { scale: 0.96, y: 1 } : undefined}
      className={cn(
        // Shares the app-wide "tactile" language (see buttonVariants' doc
        // comment in components/ui/button.tsx) — a colored 3D lip that's
        // this option's own `accentColor` while idle, or a solid
        // success/destructive fill with a matching lip once the round
        // resolves, instead of the old flat bordered card.
        "btn-tactile flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left text-lg font-bold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none",
        state === "idle" &&
          "border-[var(--option-accent)] bg-card shadow-[0_4px_0_0_color-mix(in_srgb,var(--option-accent)_100%,black_15%)] hover:shadow-[0_6px_0_0_color-mix(in_srgb,var(--option-accent)_100%,black_15%),0_10px_16px_-6px_color-mix(in_srgb,var(--option-accent)_50%,transparent)]",
        state === "correct" &&
          "border-success bg-success text-success-foreground shadow-[0_4px_0_0_color-mix(in_srgb,var(--success)_100%,black_20%),0_8px_14px_-6px_color-mix(in_srgb,var(--success)_60%,transparent)]",
        state === "incorrect" &&
          "border-destructive bg-destructive text-destructive-foreground shadow-[0_4px_0_0_color-mix(in_srgb,var(--destructive)_100%,black_20%),0_8px_14px_-6px_color-mix(in_srgb,var(--destructive)_60%,transparent)]",
        state === "dim" && "border-border bg-card shadow-none",
      )}
      style={state === "idle" ? ({ "--option-accent": accentColor } as CSSProperties) : undefined}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-black",
          state === "idle" && "text-white",
          (state === "correct" || state === "incorrect") && "bg-white/20 text-white",
          state === "dim" && "bg-secondary text-muted-foreground",
        )}
        style={state === "idle" ? { backgroundColor: accentColor } : undefined}
      >
        {state === "correct" ? (
          <Check className="size-5" />
        ) : state === "incorrect" ? (
          <X className="size-5" />
        ) : (
          letter
        )}
      </span>
      <span className="flex-1">{label}</span>
    </motion.button>
  );
}
