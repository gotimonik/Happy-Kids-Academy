const BLOBS = [
  { color: "#6c5ce7", top: "-4%", left: "-6%", size: "24rem", duration: "22s", delay: "0s" },
  { color: "#00b894", top: "2%", left: "78%", size: "20rem", duration: "27s", delay: "-9s" },
  { color: "#fdcb6e", top: "72%", left: "82%", size: "26rem", duration: "31s", delay: "-16s" },
  { color: "#ff707d", top: "78%", left: "-8%", size: "22rem", duration: "25s", delay: "-4s" },
] as const;

const SPARKLES = [
  { top: "14%", left: "22%", size: "10px", duration: "2.6s", delay: "0s" },
  { top: "24%", left: "68%", size: "8px", duration: "3.2s", delay: "-1s" },
  { top: "52%", left: "12%", size: "9px", duration: "2.9s", delay: "-2s" },
  { top: "62%", left: "88%", size: "7px", duration: "3.6s", delay: "-0.5s" },
  { top: "84%", left: "40%", size: "9px", duration: "3s", delay: "-2.4s" },
  { top: "38%", left: "48%", size: "6px", duration: "2.4s", delay: "-1.6s" },
] as const;

/**
 * Ambient, decorative "live" background: a handful of large blurred color
 * blobs drifting on independent loops, plus small twinkling sparkle dots.
 * Purely CSS-driven (no JS/React state), fixed to the viewport behind every
 * page, and never intercepts input. `prefers-reduced-motion` is handled
 * globally in `globals.css` (all animation durations collapse to ~0), so no
 * extra handling is needed here.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOBS.map((blob, index) => (
        <span
          key={index}
          className="animate-float-blob absolute rounded-full blur-3xl"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            backgroundColor: `color-mix(in srgb, ${blob.color} 24%, transparent)`,
            animationDuration: blob.duration,
            animationDelay: blob.delay,
          }}
        />
      ))}
      {SPARKLES.map((sparkle, index) => (
        <span
          key={index}
          className="animate-twinkle absolute rounded-full bg-[#FDCB6E]"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            animationDuration: sparkle.duration,
            animationDelay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
}
