"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animalsCategory } from "@/data/categories/animals";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { shuffle } from "@/lib/quiz/utils";

export interface MemoryCard {
  readonly id: number;
  readonly pairId: number;
  readonly icon: string;
  readonly label: string;
}

const PAIR_COUNT = 6;

function pairsToCards(items: readonly { icon?: string; label: string }[]): MemoryCard[] {
  return items.flatMap((item, pairId) => [
    { id: pairId * 2, pairId, icon: item.icon ?? "🐾", label: item.label },
    { id: pairId * 2 + 1, pairId, icon: item.icon ?? "🐾", label: item.label },
  ]);
}

/** Deterministic deck (first N animals, unshuffled) used only for the very first render. */
function deterministicDeck(): MemoryCard[] {
  return pairsToCards(animalsCategory.items.slice(0, PAIR_COUNT));
}

/** Randomized deck — only ever called post-mount or from an event handler. */
function shuffledDeck(): MemoryCard[] {
  const chosen = shuffle(animalsCategory.items).slice(0, PAIR_COUNT);
  return shuffle(pairsToCards(chosen));
}

export function useMemoryGame() {
  const [deck, setDeck] = useState<MemoryCard[]>(deterministicDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playWinChime } = useChime();

  useEffect(() => {
    // The real, shuffled deck depends on `Math.random()`, so it replaces the
    // deterministic placeholder deck post-mount rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeck(shuffledDeck());
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDeck(shuffledDeck());
    setFlipped([]);
    setMatchedPairs(new Set());
    setMoves(0);
  }, []);

  const flip = useCallback(
    (cardId: number) => {
      if (flipped.length === 2) return;
      if (flipped.includes(cardId)) return;
      const card = deck.find((c) => c.id === cardId);
      if (!card || matchedPairs.has(card.pairId)) return;

      const nextFlipped = [...flipped, cardId];
      setFlipped(nextFlipped);

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [firstId, secondId] = nextFlipped;
        const first = deck.find((c) => c.id === firstId);
        const second = deck.find((c) => c.id === secondId);

        if (first && second && first.pairId === second.pairId) {
          vibrate(30);
          playWinChime();
          timeoutRef.current = setTimeout(() => {
            setMatchedPairs((prev) => new Set(prev).add(first.pairId));
            setFlipped([]);
          }, 500);
        } else {
          timeoutRef.current = setTimeout(() => setFlipped([]), 900);
        }
      }
    },
    [flipped, deck, matchedPairs, playWinChime],
  );

  const isComplete = deck.length > 0 && matchedPairs.size === deck.length / 2;

  return { deck, flipped, matchedPairs, moves, isComplete, flip, reset };
}
