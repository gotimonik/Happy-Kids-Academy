"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LevelBadge } from "@/components/shared/level-badge";
import { Skeleton } from "@/components/shared/skeleton-card";
import { heroGradient } from "@/lib/ui/tile-gradient";

/**
 * Keeps the real hero's gradient background (plain inline style, no
 * hydration dependency) but stands in for the title/tagline/badge with
 * pulsing bars — the section's `framer-motion` entrance (`initial={{
 * opacity: 0 }}`) renders that invisible starting state inline in the
 * statically-exported HTML, so without this the whole hero would sit blank
 * until React hydrates and starts the animation.
 */
function HomeHeroSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="relative overflow-hidden rounded-3xl p-6 shadow-lg sm:p-8"
      style={heroGradient()}
    >
      <Skeleton className="h-7 w-52 rounded-full bg-white/30 sm:h-8 sm:w-64" />
      <Skeleton className="mt-3 h-4 w-36 rounded-full bg-white/25" />
      <Skeleton className="mt-4 h-8 w-24 rounded-full bg-white/30" />
    </div>
  );
}

export function HomeHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <HomeHeroSkeleton />;

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
