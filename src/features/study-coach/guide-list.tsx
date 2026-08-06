"use client";

import { motion } from "framer-motion";
import type { GuideEntry } from "@/lib/study-coach/guide-content";

export function GuideList({ entries, accentColor }: { entries: readonly GuideEntry[]; accentColor: string }) {
  return (
    <ol className="flex flex-col gap-3">
      {entries.map((entry, index) => (
        <motion.li
          key={`${entry.title}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
          className="relative flex gap-4 overflow-hidden rounded-2xl border border-border p-4 shadow-sm"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 6%, var(--card))` }}
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accentColor }} />
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </span>
          <div>
            <p className="font-display font-bold">{entry.title}</p>
            <p className="text-sm text-muted-foreground">{entry.body}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
