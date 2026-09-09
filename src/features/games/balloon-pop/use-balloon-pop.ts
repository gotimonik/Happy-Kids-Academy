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

/** A random balloon color, distinct from `exclude` when possible — keeps a respawning balloon from landing on the exact shade it just had. */
function randomColor(exclude?: string): string {
  const pool = exclude ? COLORS.filter((color) => color !== exclude) : COLORS;
  const source = pool.length > 0 ? pool : COLORS;
  return source[Math.floor(Math.random() * source.length)] ?? "#FF5B6F";
}

/** Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
function shuffle<T>(input: readonly T[]): T[] {
  const result = [...input];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}

function laneX(laneIndex: number, laneCount: number): number {
  const laneWidth = (100 - LANE_MARGIN * 2) / laneCount;
  const laneCenter = LANE_MARGIN + laneIndex * laneWidth + laneWidth / 2;
  // A little jitter around the lane's center for a natural, non-robotic
  // feel — kept small on purpose so neighboring lanes always keep enough
  // clearance for the balloon's own (container-relative) diameter.
  const jitter = (Math.random() - 0.5) * laneWidth * 0.5;
  return laneCenter + jitter;
}

function spawnBalloon(
  id: number,
  laneIndex: number,
  laneCount: number,
  previousColor: string | undefined,
  forceLetter?: string,
): Balloon {
  return {
    id,
    x: laneX(laneIndex, laneCount),
    y: 100 + Math.random() * 60,
    letter: forceLetter ?? randomLetter(),
    color: randomColor(previousColor),
  };
}

/**
 * Guarantees at least one balloon in `balloons` currently carries the
 * `target` letter. Without this, every respawn independently rolls a
 * uniform random letter from all 26 — with only ~7 balloons in flight at
 * once, a run of bad luck can leave the target letter never actually
 * appearing on screen for a long stretch, forcing a child to wait
 * indefinitely for something that simply isn't coming.
 *
 * Prefers forcing the letter onto one of `preferredIds` — the balloon(s)
 * that just (re)spawned this update — so an already-visible balloon never
 * visibly flips its letter mid-air; falls back to any balloon only if none
 * of the preferred ones are available (shouldn't normally happen, since
 * the target can only *become* absent at the moment something respawns).
 */
function ensureTargetPresent(
  balloons: Balloon[],
  target: string,
  preferredIds: readonly number[] = [],
): Balloon[] {
  if (balloons.some((balloon) => balloon.letter === target)) return balloons;

  const candidateIds = preferredIds.length > 0 ? preferredIds : balloons.map((balloon) => balloon.id);
  const chosenId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  return balloons.map((balloon) => (balloon.id === chosenId ? { ...balloon, letter: target } : balloon));
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
  // Mirrors the latest `balloons` state so `pop()` can synchronously read
  // "which balloon, was it correct" without putting that decision (and its
  // side effects) inside the `setBalloons` updater itself — see `pop`'s
  // comment for why that distinction matters.
  const balloonsRef = useRef<Balloon[]>([]);
  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);
  const popsRef = useRef(0);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const laneCountRef = useRef(BALLOON_COUNT_WIDE);
  // Which lane each balloon id spawns in — shuffled fresh every game (see
  // the mount effect below) so the whole layout looks different session to
  // session, not just which letter/color lands where within a fixed grid.
  const laneAssignmentRef = useRef<number[]>([]);

  const { playWinChime } = useChime();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    // The narrow/wide check depends on the actual viewport, so it's resolved
    // post-mount along with the rest of this game's randomized setup.
    const isNarrow =
      typeof window !== "undefined" && window.matchMedia(`(max-width: ${NARROW_BREAKPOINT_PX}px)`).matches;
    const laneCount = isNarrow ? BALLOON_COUNT_NARROW : BALLOON_COUNT_WIDE;
    laneCountRef.current = laneCount;
    // Previously each balloon id always sat in lane `id % laneCount`, so
    // the very first balloon opened the game in the exact same spot with
    // the exact same color every time — this randomizes the id→lane
    // mapping once per game instead.
    laneAssignmentRef.current = shuffle(Array.from({ length: laneCount }, (_, index) => index));

    const initialTarget = randomLetter();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(initialTarget);
    setBalloons(
      Array.from({ length: laneCount }, (_, i) =>
        spawnBalloon(
          i,
          laneAssignmentRef.current[i] as number,
          laneCount,
          undefined,
          i === 0 ? initialTarget : undefined,
        ),
      ),
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

      setBalloons((current) => {
        const respawnedIds: number[] = [];
        const updated = current.map((balloon) => {
          const nextY = balloon.y - RISE_SPEED * dt;
          if (nextY < -15) {
            respawnedIds.push(balloon.id);
            return spawnBalloon(
              balloon.id,
              laneAssignmentRef.current[balloon.id] as number,
              laneCountRef.current,
              balloon.color,
              undefined,
            );
          }
          return { ...balloon, y: nextY };
        });
        return ensureTargetPresent(updated, targetRef.current, respawnedIds);
      });

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
      const balloon = balloonsRef.current.find((b) => b.id === id);
      if (!balloon) return;
      const laneIndex = laneAssignmentRef.current[id] as number;

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
        setBalloons((current) => {
          const updated = current.map((b) =>
            b.id === id
              ? spawnBalloon(b.id, laneIndex, laneCountRef.current, b.color, nextTarget)
              : b,
          );
          return ensureTargetPresent(updated, nextTarget, [id]);
        });
      } else {
        vibrate(100);
        setFeedback({ status: "incorrect", message: `That is ${balloon.letter} — find ${targetRef.current}` });
        setBalloons((current) => {
          const updated = current.map((b) =>
            b.id === id ? spawnBalloon(b.id, laneIndex, laneCountRef.current, b.color, undefined) : b,
          );
          return ensureTargetPresent(updated, targetRef.current, [id]);
        });
      }

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 900);
    },
    [playWinChime, speak],
  );

  return { balloons, target, pops, feedback, pop };
}
