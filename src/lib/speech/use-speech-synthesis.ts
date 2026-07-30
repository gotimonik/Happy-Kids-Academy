"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useSettingsStore } from "@/store/settings-store";
import { LANGUAGE_LOCALES } from "@/types/settings";
import { pickBestVoice, primeVoiceCatalog } from "./voice-catalog";

export interface SpeakOptions {
  /** Overrides the current app language's locale, e.g. for animal sound words. */
  readonly locale?: string;
  readonly pitch?: number;
  readonly rate?: number;
}

/** Detects the likely script of `text` and returns a matching BCP-47 locale. */
function localeForText(text: string): string {
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x0a80 && code <= 0x0aff) return LANGUAGE_LOCALES.gu;
    if (code >= 0x0900 && code <= 0x097f) return LANGUAGE_LOCALES.hi;
  }
  return LANGUAGE_LOCALES.en;
}

/**
 * Thin wrapper around the Web Speech API, replacing Android `TextToSpeech`.
 * Silently no-ops when unsupported or when the user has voice turned off.
 *
 * Picks the clearest available voice per locale (see `voice-catalog.ts`) and
 * uses a slightly slower, natural-pitch default so speech reads clean rather
 * than rushed or robotic — important for early readers.
 */
export function useSpeechSynthesis() {
  const voiceOn = useSettingsStore((state) => state.voiceOn);

  const isSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  useEffect(() => {
    if (isSupported) primeVoiceCatalog();
  }, [isSupported]);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!voiceOn || !isSupported || !text) return;
      window.speechSynthesis.cancel();

      const locale = options.locale ?? localeForText(text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.rate = options.rate ?? 0.95;
      utterance.volume = 1;

      const voice = pickBestVoice(locale);
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);
    },
    [voiceOn, isSupported],
  );

  const cancel = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, cancel, isSupported, voiceOn };
}
