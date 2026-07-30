"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedbackStatus = "correct" | "incorrect";

export interface FeedbackToastProps {
  status: FeedbackStatus | null;
  message: string;
}

/**
 * Bottom feedback bar shown after answering a quiz question or game round.
 * Replaces the Android app's hand-drawn bottom toast; announces via `aria-live`
 * so screen-reader / caption users get the same signal spoken feedback gave.
 */
export function FeedbackToast({ status, message }: FeedbackToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-20 z-40 flex justify-center md:bottom-6">
      <AnimatePresence>
        {status && (
          <motion.div
            role={status === "incorrect" ? "alert" : "status"}
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={cn(
              "pointer-events-auto flex max-w-md items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl",
              status === "correct" ? "bg-success" : "bg-destructive",
            )}
          >
            {status === "correct" ? (
              <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="size-5 shrink-0" aria-hidden="true" />
            )}
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
