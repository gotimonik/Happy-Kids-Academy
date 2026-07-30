"use client";

import { useCallback, useEffect, useState } from "react";
import { alphabetCategory } from "@/data/categories/alphabet";
import { fruitsCategory } from "@/data/categories/fruits";
import { numbersCategory } from "@/data/categories/numbers";
import { shapesCategory } from "@/data/categories/shapes";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { shuffle } from "@/lib/quiz/utils";
import type { LearningItem } from "@/types/item";

type MatchMode = "letter" | "number" | "shape" | "fruit";

const MODES: readonly { mode: MatchMode; title: string; category: typeof alphabetCategory }[] = [
  { mode: "letter", title: "Letter → Picture", category: alphabetCategory },
  { mode: "number", title: "Number → Word", category: numbersCategory },
  { mode: "shape", title: "Shape → Name", category: shapesCategory },
  { mode: "fruit", title: "Fruit → Name", category: fruitsCategory },
];

function pickRound() {
  const config = MODES[Math.floor(Math.random() * MODES.length)] ?? MODES[0]!;
  const items = shuffle(config.category.items).slice(0, 3) as LearningItem[];
  return {
    mode: config.mode,
    title: config.title,
    items,
    rightOrder: shuffle([0, 1, 2]),
  };
}

function initialRound(): ReturnType<typeof pickRound> {
  const config = MODES[0]!;
  return {
    mode: config.mode,
    title: config.title,
    items: config.category.items.slice(0, 3) as LearningItem[],
    rightOrder: [0, 1, 2],
  };
}

export function leftValueFor(mode: MatchMode, item: LearningItem): string {
  if (mode === "letter" || mode === "number" || mode === "shape") return item.symbol ?? item.icon ?? "";
  return item.icon ?? "";
}

export function rightValueFor(mode: MatchMode, item: LearningItem): string {
  if (mode === "letter") return `${item.icon ?? ""}  ${item.label}`;
  return item.label;
}

export function useMatchingGame() {
  const [round, setRound] = useState(initialRound);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<boolean[]>([false, false, false]);
  const [feedback, setFeedback] = useState<{ status: "correct" | "incorrect"; message: string } | null>(
    null,
  );

  const { playWinChime } = useChime();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    // Randomized first round is chosen post-mount, not during the initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRound(pickRound());
  }, []);

  const nextRound = useCallback(() => {
    setRound(pickRound());
    setSelectedLeft(null);
    setMatched([false, false, false]);
    setFeedback(null);
  }, []);

  const selectLeft = useCallback((index: number) => {
    if (matched[index]) return;
    setSelectedLeft(index);
  }, [matched]);

  const selectRight = useCallback(
    (rightPosition: number) => {
      const targetIndex = round.rightOrder[rightPosition];
      if (targetIndex === undefined || matched[targetIndex]) return;

      if (selectedLeft === null) {
        setFeedback({ status: "incorrect", message: "Choose an item on the left first" });
        return;
      }

      if (targetIndex === selectedLeft) {
        const nextMatched = [...matched];
        nextMatched[selectedLeft] = true;
        setMatched(nextMatched);
        setSelectedLeft(null);
        vibrate(30);
        playWinChime();
        const allDone = nextMatched.every(Boolean);
        if (allDone) {
          setFeedback({ status: "correct", message: "All matched! Wonderful!" });
          speak("All matched! Wonderful!");
        } else {
          setFeedback({ status: "correct", message: "Great match!" });
        }
      } else {
        vibrate(100);
        setFeedback({ status: "incorrect", message: "Not this one — try again" });
      }
    },
    [round, selectedLeft, matched, playWinChime, speak],
  );

  const allMatched = matched.every(Boolean);

  return {
    mode: round.mode,
    title: round.title,
    items: round.items,
    rightOrder: round.rightOrder,
    selectedLeft,
    matched,
    feedback,
    allMatched,
    selectLeft,
    selectRight,
    nextRound,
  };
}
