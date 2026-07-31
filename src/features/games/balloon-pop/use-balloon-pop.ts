"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";

export interface Balloon {
  readonly id: number;
  x: number;
  y: number;
  letter: string;
  color: string;
}

const COLORS = ["#FF5B6F", "#45AAF2", "#37C183", "#A45EEA", "#FF9F43", "#E84393", "#00B894"];
const RISE_SPEED = 9; // percent of container height per second

// A fixed-size touch target (min ~44px for accessibility) physically can't
// fit 7-across without overlap on a narrow phone width — there just isn't
// enough room. So fewer balloons are ever in flight at once on narrow
// screens, rather than shrinking them below a usable touch size.
const BALLOON_COUNT_WIDE = 7;
const BALLOON_COUNT_NARROW = 4;
const NARROW_BREAKPOINT_PX = 640; // matches Tailwind's `sm`

// Each balloon id keeps its own horizontal "lane" for its entire lifetime
// (including respawns) so balloons can never drift into each other, no
// matter how narrow the play area is.
const LANE_MARGIN = 8; // % kept clear on each side so balloons stay fully inside the container

function randomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function laneX(id: number, laneCount: number): number {
  const laneWidth = (100 - LANE_MARGIN * 2) / laneCount;
  const lane = id % laneCount;
  const laneCenter = LANE_MARGIN + lane * laneWidth + laneWidth / 2;
  // A little jitter around the lane's center for a natural, non-robotic
  // feel — kept small on purpose so neighboring lanes always keep enough
  // clearance for the balloon's own (container-relative) diameter.
  const jitter = (Math.random() - 0.5) * laneWidth * 0.2;
  return laneCenter + jitter;
}

function spawnBalloon(id: number, laneCount: number, forceLetter?: string): Balloon {
  return {
    id,
    x: laneX(id, laneCount),
    y: 100 + Math.random() * 60,
    letter: forceLetter ?? randomLetter(),
    color: COLORS[id % COLORS.length] ?? "#FF5B6F",
  };
}

export function useBalloonPop() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [target, setTarget] = useState("A");
  const [pops, setPops] = useState(0);
  const [feedback, setFeedback] = useState<{ status: "correct" | "incorrect"; message: string } | null>(
    null,
  );
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);
  const popsRef = useRef(0);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const laneCountRef = useRef(BALLOON_COUNT_WIDE);

  const { playWinChime } = useChime();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    // The narrow/wide check depends on the actual viewport, so it's resolved
    // post-mount along with the rest of this game's randomized setup.
    const isNarrow =
      typeof window !== "undefined" && window.matchMedia(`(max-width: ${NARROW_BREAKPOINT_PX}px)`).matches;
    const laneCount = isNarrow ? BALLOON_COUNT_NARROW : BALLOON_COUNT_WIDE;
    laneCountRef.current = laneCount;

    const initialTarget = randomLetter();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(initialTarget);
    setBalloons(
      Array.from({ length: laneCount }, (_, i) => spawnBalloon(i, laneCount, i === 0 ? initialTarget : undefined)),
    );
    speak(`Pop the letter ${initialTarget}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time setup on mount
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function tick(time: number) {
      const last = lastFrameRef.current ?? time;
      const dt = Math.min(0.05, (time - last) / 1000);
      lastFrameRef.current = time;

      setBalloons((current) =>
        current.map((balloon) => {
          const nextY = balloon.y - RISE_SPEED * dt;
          if (nextY < -15) {
            return spawnBalloon(balloon.id, laneCountRef.current, undefined);
          }
          return { ...balloon, y: nextY };
        }),
      );

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const pop = useCallback(
    (id: number) => {
      setBalloons((current) => {
        const balloon = current.find((b) => b.id === id);
        if (!balloon) return current;

        if (balloon.letter === targetRef.current) {
          const nextPops = popsRef.current + 1;
          popsRef.current = nextPops;
          setPops(nextPops);
          vibrate(28);
          playWinChime();
          setFeedback({ status: "correct", message: "Great pop!" });

          let nextTarget = targetRef.current;
          if (nextPops % 3 === 0) {
            nextTarget = randomLetter();
            setTarget(nextTarget);
            speak(`Now pop the letter ${nextTarget}`);
          }
          return current.map((b) => (b.id === id ? spawnBalloon(b.id, laneCountRef.current, nextTarget) : b));
        }

        vibrate(100);
        setFeedback({ status: "incorrect", message: `That is ${balloon.letter} — find ${targetRef.current}` });
        return current.map((b) => (b.id === id ? spawnBalloon(b.id, laneCountRef.current, undefined) : b));
      });

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 900);
    },
    [playWinChime, speak],
  );

  return { balloons, target, pops, feedback, pop };
}
