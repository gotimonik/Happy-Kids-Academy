"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animalsCategory } from "@/data/categories/animals";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { shuffle } from "@/lib/quiz/utils";
import type { LearningItem } from "@/types/item";

const TOTAL_ROUNDS = 8;
const SOUND_ITEMS = animalsCategory.items.filter((item) => Boolean(item.sound));

function pickRound(): { target: LearningItem; options: LearningItem[] } {
  const target = SOUND_ITEMS[Math.floor(Math.random() * SOUND_ITEMS.length)] ?? SOUND_ITEMS[0]!;
  const distractors = shuffle(animalsCategory.items.filter((item) => item.id !== target.id)).slice(0, 2);
  return { target, options: shuffle([target, ...distractors]) };
}

export function useSoundSafari() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState<{ target: LearningItem; options: LearningItem[] } | null>(null);
  const [status, setStatus] = useState<"answering" | "correct" | "incorrect" | "finished">("answering");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { speak } = useSpeechSynthesis();
  const { playWinChime } = useChime();

  const speakSound = useCallback(
    (target: LearningItem) => {
      speak(target.sound ?? target.label, { rate: 0.8, pitch: 0.9 });
    },
    [speak],
  );

  useEffect(() => {
    // First round depends on `Math.random()`, so it's chosen post-mount.
    const first = pickRound();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(first);
    speakSound(first.target);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const replay = useCallback(() => {
    if (current) speakSound(current.target);
  }, [current, speakSound]);

  const answer = useCallback(
    (itemId: string) => {
      if (status !== "answering" || !current) return;

      if (itemId === current.target.id) {
        const nextRound = round + 1;
        setScore((s) => s + 1);
        setStatus("correct");
        vibrate(30);
        playWinChime();

        timeoutRef.current = setTimeout(() => {
          if (nextRound >= TOTAL_ROUNDS) {
            setRound(nextRound);
            setStatus("finished");
          } else {
            const next = pickRound();
            setRound(nextRound);
            setCurrent(next);
            setStatus("answering");
            speakSound(next.target);
          }
        }, 900);
      } else {
        setStatus("incorrect");
        vibrate(100);
        timeoutRef.current = setTimeout(() => setStatus("answering"), 800);
      }
    },
    [status, current, round, playWinChime, speakSound],
  );

  const restart = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const first = pickRound();
    setRound(0);
    setScore(0);
    setCurrent(first);
    setStatus("answering");
    speakSound(first.target);
  }, [speakSound]);

  return { round, totalRounds: TOTAL_ROUNDS, score, current, status, answer, replay, restart };
}
