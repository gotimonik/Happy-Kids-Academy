"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { vibrate } from "@/lib/haptics/vibrate";

export const PAD_COUNT = 4;
const PAD_FREQUENCIES = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
const STEP_ON_MS = 480;
const STEP_GAP_MS = 220;
const ROUND_START_DELAY_MS = 900;

export type SimonPhase = "idle" | "playing" | "input" | "gameover";

type AudioContextConstructor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
  );
}

export function useSimonPattern() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userIndex, setUserIndex] = useState(0);
  const [level, setLevel] = useState(0);
  const [phase, setPhase] = useState<SimonPhase>("idle");
  const [activePad, setActivePad] = useState<number | null>(null);
  const [bestLevel, setBestLevel] = useState(0);

  const generationRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const contextRef = useRef<AudioContext | null>(null);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  const playTone = useCallback((padIndex: number) => {
    const Ctor = getAudioContextConstructor();
    if (!Ctor) return;
    const context = contextRef.current ?? new Ctor();
    contextRef.current = context;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = PAD_FREQUENCIES[padIndex] ?? 440;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.28, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.35);
  }, []);

  const playSequence = useCallback(
    (fullSequence: number[], generation: number) => {
      setPhase("playing");
      fullSequence.forEach((pad, i) => {
        const onTimeout = setTimeout(() => {
          if (generation !== generationRef.current) return;
          setActivePad(pad);
          playTone(pad);
        }, i * (STEP_ON_MS + STEP_GAP_MS));
        const offTimeout = setTimeout(() => {
          if (generation !== generationRef.current) return;
          setActivePad(null);
        }, i * (STEP_ON_MS + STEP_GAP_MS) + STEP_ON_MS);
        timeoutsRef.current.push(onTimeout, offTimeout);
      });

      const endTimeout = setTimeout(
        () => {
          if (generation !== generationRef.current) return;
          setPhase("input");
          setUserIndex(0);
        },
        fullSequence.length * (STEP_ON_MS + STEP_GAP_MS) + 200,
      );
      timeoutsRef.current.push(endTimeout);
    },
    [playTone],
  );

  const addStep = useCallback(
    (currentSequence: number[]) => {
      const generation = ++generationRef.current;
      const nextPad = Math.floor(Math.random() * PAD_COUNT);
      const nextSequence = [...currentSequence, nextPad];
      setSequence(nextSequence);
      setLevel(nextSequence.length);

      const startTimeout = setTimeout(() => {
        if (generation !== generationRef.current) return;
        playSequence(nextSequence, generation);
      }, ROUND_START_DELAY_MS);
      timeoutsRef.current.push(startTimeout);
    },
    [playSequence],
  );

  const start = useCallback(() => {
    clearTimeouts();
    generationRef.current += 1;
    setSequence([]);
    setUserIndex(0);
    setLevel(0);
    setActivePad(null);
    setPhase("idle");
    addStep([]);
  }, [clearTimeouts, addStep]);

  useEffect(() => {
    // Kick off the first round post-mount rather than during the initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    addStep([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const tapPad = useCallback(
    (padIndex: number) => {
      if (phase !== "input") return;
      playTone(padIndex);

      const expected = sequence[userIndex];
      if (padIndex !== expected) {
        vibrate([80, 40, 80]);
        clearTimeouts();
        setPhase("gameover");
        setBestLevel((best) => Math.max(best, level));
        return;
      }

      const nextUserIndex = userIndex + 1;
      if (nextUserIndex === sequence.length) {
        vibrate(30);
        setPhase("idle");
        addStep(sequence);
      } else {
        setUserIndex(nextUserIndex);
      }
    },
    [phase, sequence, userIndex, level, playTone, clearTimeouts, addStep],
  );

  return { phase, activePad, level, bestLevel, tapPad, start };
}
