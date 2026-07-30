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
const BALLOON_COUNT = 7;
const RISE_SPEED = 9; // percent of container height per second

function randomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function spawnBalloon(id: number, forceLetter?: string): Balloon {
  return {
    id,
    x: 8 + Math.random() * 80,
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

  const { playWinChime } = useChime();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    // Randomized starting target/balloons are chosen post-mount, not during the initial render.
    const initialTarget = randomLetter();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(initialTarget);
    setBalloons(
      Array.from({ length: BALLOON_COUNT }, (_, i) => spawnBalloon(i, i === 0 ? initialTarget : undefined)),
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
            return spawnBalloon(balloon.id, undefined);
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
          return current.map((b) => (b.id === id ? spawnBalloon(b.id, nextTarget) : b));
        }

        vibrate(100);
        setFeedback({ status: "incorrect", message: `That is ${balloon.letter} — find ${targetRef.current}` });
        return current.map((b) => (b.id === id ? spawnBalloon(b.id, undefined) : b));
      });

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 900);
    },
    [playWinChime, speak],
  );

  return { balloons, target, pops, feedback, pop };
}
