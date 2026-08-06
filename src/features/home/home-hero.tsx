"use client";

import { motion } from "framer-motion";
import { LevelBadge } from "@/components/shared/level-badge";
import { heroGradient } from "@/lib/ui/tile-gradient";

export function HomeHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
      style={heroGradient()}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/20 to-transparent"
      />
      <span aria-hidden="true" className="absolute -right-10 -top-14 size-44 rounded-full bg-white/10" />
      <span aria-hidden="true" className="absolute -left-10 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />
      <span
        aria-hidden="true"
        className="animate-float absolute right-6 top-4 text-4xl drop-shadow-sm sm:right-10 sm:top-6 sm:text-5xl"
      >
        🎈
      </span>

      <h1 className="relative font-display text-2xl font-bold sm:text-3xl">Happy Kids Academy</h1>
      <p className="relative mt-1 text-sm text-white/85 sm:text-base">Learn • Play • Grow ✨</p>
      <div className="relative mt-4">
        <LevelBadge />
      </div>
    </motion.section>
  );
}
