"use client";

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
      whileTap={state === "idle" ? { scale: 0.97 } : undefined}
      className={cn(
        "flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left text-lg font-bold shadow-sm transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none",
        state === "idle" && "border-border bg-card hover:shadow-md",
        state === "correct" && "border-success bg-success text-success-foreground shadow-md",
        state === "incorrect" && "border-destructive bg-destructive text-destructive-foreground shadow-md",
        state === "dim" && "border-border bg-card",
      )}
      style={state === "idle" ? { borderColor: accentColor } : undefined}
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
