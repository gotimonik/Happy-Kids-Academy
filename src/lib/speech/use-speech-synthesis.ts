"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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
 * Works around two well-known browser bugs that otherwise make speech sound
 * clipped, garbled, or like it "swallows" the start of a word:
 *  1. Chromium garbage-collects an utterance that has no live JS reference,
 *     sometimes stopping it mid-word — we keep a ref to the current utterance
 *     until it finishes.
 *  2. Calling `speak()` immediately after `cancel()` while the engine is still
 *     mid-utterance can drop or corrupt the next utterance — we wait a beat
 *     for the cancel to actually take effect before queueing the new one.
 */
export function useSpeechSynthesis() {
  const voiceOn = useSettingsStore((state) => state.voiceOn);

  const isSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSupported) primeVoiceCatalog();
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, []);

  const speakNow = useCallback((text: string, options: SpeakOptions) => {
    const synth = window.speechSynthesis;
    const locale = options.locale ?? localeForText(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = options.pitch ?? 1.0;
    utterance.rate = options.rate ?? 0.95;
    utterance.volume = 1;

    const voice = pickBestVoice(locale);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = locale;
    }

    // Hold a strong reference so Chrome can't garbage-collect the utterance
    // mid-speech (a long-standing bug where speech otherwise cuts off silently).
    utteranceRef.current = utterance;

    // Chrome silently pauses speech after ~15s of continuous synthesis; a
    // periodic pause/resume nudge keeps longer phrases (e.g. counted sequences)
    // playing all the way through.
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
      if (synth.speaking) {
        synth.pause();
        synth.resume();
      }
    }, 10_000);

    const stopHeartbeat = () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
    utterance.onend = stopHeartbeat;
    utterance.onerror = stopHeartbeat;

    synth.speak(utterance);
  }, []);

  const speak = useCallback(
    (rawText: string, options: SpeakOptions = {}) => {
      const text = rawText.trim();
      if (!voiceOn || !isSupported || !text) return;

      const synth = window.speechSynthesis;
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);

      if (synth.speaking || synth.pending) {
        synth.cancel();
        // Give the engine a tick to actually flush the previous utterance
        // before queueing the next one — speaking immediately after cancel()
        // is what causes the next utterance to sound clipped or get dropped.
        queueTimeoutRef.current = setTimeout(() => speakNow(text, options), 60);
      } else {
        speakNow(text, options);
      }
    },
    [voiceOn, isSupported, speakNow],
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, cancel, isSupported, voiceOn };
}
