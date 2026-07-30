"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#6C5CE7", "#FFD166", "#37C183", "#EE6352", "#45AAF2"];

interface ConfettiPiece {
  readonly id: number;
  readonly left: number;
  readonly delay: number;
  readonly color: string;
  readonly rotate: number;
}

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    color: COLORS[i % COLORS.length] ?? "#6C5CE7",
    rotate: Math.random() * 360,
  }));
}

/** A short celebratory confetti burst. Respects `prefers-reduced-motion` via reduced durations. */
export function ConfettiOverlay({ count = 24 }: { count?: number }) {
  // Randomized layout is generated post-mount (not during render) to keep
  // rendering pure; a one-frame delay before the burst appears is imperceptible.
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Randomized decorative layout can only be computed client-side, after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(generatePieces(count));
  }, [count]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ y: -40, x: `${piece.left}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: piece.rotate }}
          transition={{ duration: 1.6, delay: piece.delay, ease: "easeIn" }}
          className="absolute top-0 block size-2.5 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
