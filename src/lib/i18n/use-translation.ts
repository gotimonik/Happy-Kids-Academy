"use client";

import { useMemo } from "react";
import { useSettingsStore } from "@/store/settings-store";
import { TRANSLATIONS, type TranslationKey } from "./translations";

/**
 * `t(key, vars?)` for the current `language` setting — falls back to English
 * for any key missing in the active dictionary (there shouldn't be any,
 * `TRANSLATIONS` is fully typed per-language, but this keeps a runtime gap
 * from ever rendering blank). `{name}`-style tokens in the string are
 * replaced from `vars`, e.g. `t("learn.tile.learnSubtitle", { count: 12 })`.
 *
 * Reads `language` directly from the store (not through a hydration guard)
 * so it renders instantly with the default "en" on first paint and re-renders
 * once Zustand's `persist` middleware rehydrates the saved choice — the same
 * brief-flash tradeoff already accepted elsewhere for `alphabetCase`/
 * `numberScript` (see `CategoryHub`) rather than gating everything on a
 * skeleton just for this.
 */
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  return useMemo(() => {
    const dict = TRANSLATIONS[language];
    return function t(key: TranslationKey, vars?: Record<string, string | number>): string {
      let text = dict[key] ?? TRANSLATIONS.en[key];
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    };
  }, [language]);
}
