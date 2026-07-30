"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CoachGrade } from "@/lib/study-coach/guide-content";

interface StudyCoachState {
  readonly grade: CoachGrade;
  readonly gameIndex: number;
  readonly setGrade: (grade: CoachGrade) => void;
  readonly cycleGame: () => void;
}

export const useStudyCoachStore = create<StudyCoachState>()(
  persist(
    (set) => ({
      grade: 2,
      gameIndex: 0,
      setGrade: (grade) => set({ grade }),
      cycleGame: () => set((state) => ({ gameIndex: (state.gameIndex + 1) % 4 })),
    }),
    { name: "hka-study-coach" },
  ),
);
