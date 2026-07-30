"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_SETTINGS, type AppLanguage, type SettingsState } from "@/types/settings";

interface SettingsActions {
  setLanguage: (language: AppLanguage) => void;
  cycleLanguage: () => void;
  toggleVoice: () => void;
  toggleMusic: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

const LANGUAGE_ORDER: AppLanguage[] = ["en", "gu", "hi"];

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...INITIAL_SETTINGS,
      setLanguage: (language) => set(() => ({ language })),
      cycleLanguage: () =>
        set((state) => {
          const currentIndex = LANGUAGE_ORDER.indexOf(state.language);
          const nextIndex = (currentIndex + 1) % LANGUAGE_ORDER.length;
          return { language: LANGUAGE_ORDER[nextIndex] };
        }),
      toggleVoice: () => set((state) => ({ voiceOn: !state.voiceOn })),
      toggleMusic: () => set((state) => ({ musicOn: !state.musicOn })),
    }),
    { name: "hka-settings" },
  ),
);
