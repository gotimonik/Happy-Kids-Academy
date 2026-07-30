"use client";

import { useCallback, useEffect, useState } from "react";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { shuffle } from "@/lib/quiz/utils";

const TILE_COUNT = 6;

function orderedTiles(): number[] {
  return Array.from({ length: TILE_COUNT }, (_, i) => i + 1);
}

export function usePuzzleGame() {
  const [tiles, setTiles] = useState<number[]>(orderedTiles);
  const [next, setNext] = useState(1);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const { playWinChime } = useChime();

  useEffect(() => {
    // Shuffled order depends on `Math.random()`, so it's set post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTiles(shuffle(orderedTiles()));
  }, []);

  const reset = useCallback(() => {
    setTiles(shuffle(orderedTiles()));
    setNext(1);
    setWrongTile(null);
  }, []);

  const select = useCallback(
    (value: number) => {
      if (value === next) {
        vibrate(25);
        if (next === TILE_COUNT) playWinChime();
        setNext((n) => n + 1);
      } else {
        setWrongTile(value);
        vibrate(100);
        setTimeout(() => setWrongTile(null), 500);
      }
    },
    [next, playWinChime],
  );

  const isComplete = next > TILE_COUNT;

  return { tiles, next, wrongTile, isComplete, select, reset };
}
