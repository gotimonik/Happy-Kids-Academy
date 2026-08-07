"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { pickLivingPreset, type LivingPreset } from "@/lib/living/presets";

interface EntranceAnimation {
  readonly initial: TargetAndTransition;
  readonly animate: TargetAndTransition;
}

const ENTRANCE_VARIANTS: Record<LivingPreset, EntranceAnimation> = {
  grow: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 14 } },
  },
  land: {
    initial: { y: -70, x: 24, opacity: 0, rotate: -8 },
    animate: { y: 0, x: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 170, damping: 12 } },
  },
  walk: {
    initial: { x: -56, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  swim: {
    initial: { x: 48, opacity: 0, rotate: 6 },
    animate: { x: 0, opacity: 1, rotate: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  fly: {
    initial: { x: -56, y: -36, opacity: 0, rotate: -15 },
    animate: { x: 0, y: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 140, damping: 10 } },
  },
  "drive-in": {
    initial: { x: -72, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 210, damping: 18 } },
  },
  twinkle: {
    initial: { scale: 0.5, opacity: 0, rotate: -20 },
    animate: { scale: 1, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 10 } },
  },
  pop: {
    initial: { scale: 0.4, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 16 } },
  },
};

// A subtle continuous bob layered on top of the entrance so items feel alive
// once they've landed, without competing with the label/detail text below.
const IDLE_BOB: TargetAndTransition = {
  y: [0, -4, 0],
  transition: { duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" },
};

const REDUCED_MOTION_ANIMATE = { opacity: 1, transition: { duration: 0.2 } };

/**
 * Wraps a decorative item icon (emoji) with a "Living Scene" entrance
 * animation chosen from the item's label — Apple grows, Parrot lands, Cat
 * walks in, Kite flies in, and so on. Tap/press replays the animation, which
 * doubles as a lightweight "look, it's alive!" affordance for kids.
 *
 * Respects `prefers-reduced-motion`: falls back to a plain fade-in and skips
 * the idle bob entirely.
 */
export function LivingIcon({
  label,
  children,
  className,
}: {
  /** The item's label, e.g. "Parrot" — used to pick a fitting animation. */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const preset = pickLivingPreset(label);
  const prefersReducedMotion = useReducedMotion();
  const [replayKey, setReplayKey] = useState(0);
  const variant = ENTRANCE_VARIANTS[preset];

  function replay() {
    setReplayKey((key) => key + 1);
  }

  return (
    <motion.span
      key={replayKey}
      role="button"
      tabIndex={0}
      aria-label={`Play ${label}'s animation again`}
      onClick={replay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          replay();
        }
      }}
      initial={prefersReducedMotion ? { opacity: 0 } : variant.initial}
      animate={prefersReducedMotion ? REDUCED_MOTION_ANIMATE : variant.animate}
      className={cn("inline-block cursor-pointer", className)}
    >
      <motion.span
        className="inline-block"
        animate={prefersReducedMotion ? undefined : IDLE_BOB}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
