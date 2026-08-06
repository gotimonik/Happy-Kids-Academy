"use client";

import { motion } from "framer-motion";

/**
 * Pass a `key` that changes every round (e.g. `key={round}`) so this remounts
 * per question and the pop-in below replays instead of only firing once.
 */
export function QuestionCard({ prompt, accentColor }: { prompt: string; accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex min-h-32 items-center justify-center overflow-hidden rounded-3xl border border-border p-6 text-center shadow-md sm:min-h-40"
      style={{
        backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 18%, var(--card)) 0%, var(--card) 70%)`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-8 -top-10 size-28 rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 20%, transparent)` }}
      />
      <span
        aria-hidden="true"
        className="absolute -left-10 -bottom-12 size-32 rounded-full blur-sm"
        style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)` }}
      />
      <p className="relative font-display text-4xl font-bold sm:text-5xl">{prompt}</p>
    </motion.div>
  );
}
