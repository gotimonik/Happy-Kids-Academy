"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSettingsStore } from "@/store/settings-store";
import { LANGUAGE_LOCALES } from "@/types/settings";
import {
  loadVoices,
  pickBestVoice,
  primeVoiceCatalog,
} from "./voice-catalog";
import { isNativeTTSSupported, NativeTTS } from "./native-tts";

export interface SpeakOptions {
  readonly locale?: string;
  readonly pitch?: number;
  readonly rate?: number;
}

function localeForText(text: string): string {
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;

    if (code >= 0x0a80 && code <= 0x0aff) {
      return LANGUAGE_LOCALES.gu;
    }

    if (code >= 0x0900 && code <= 0x097f) {
      return LANGUAGE_LOCALES.hi;
    }
  }

  return LANGUAGE_LOCALES.en;
}

export function useSpeechSynthesis() {
  const voiceOn = useSettingsStore((state) => state.voiceOn);

  const useNativeTTS = useMemo(() => isNativeTTSSupported(), []);
  const isSupported = useMemo(
    () =>
      useNativeTTS ||
      (typeof window !== "undefined" &&
        "speechSynthesis" in window),
    [useNativeTTS],
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isSupported || useNativeTTS) return;

    primeVoiceCatalog();
  }, [isSupported, useNativeTTS]);

  useEffect(() => {
    return () => {
      if (queueTimeoutRef.current) {
        clearTimeout(queueTimeoutRef.current);
      }

      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, []);

  const speakNow = useCallback(
    async (text: string, options: SpeakOptions) => {
      if (useNativeTTS) {
        try {
          await NativeTTS.speak({
            text,
            locale: options.locale ?? localeForText(text),
            pitch: options.pitch ?? 1,
            rate: options.rate ?? 0.95,
          });
        } catch (error) {
          console.warn("Native text-to-speech failed.", error);
        }

        return;
      }

      const synth = window.speechSynthesis;

      // Make sure voices have been loaded.
      await loadVoices();

      const locale = options.locale ?? localeForText(text);

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.pitch = options.pitch ?? 1;
      utterance.rate = options.rate ?? 0.95;
      utterance.volume = 1;

      const voice = await pickBestVoice(locale);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = locale;
      }

      utteranceRef.current = utterance;

      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }

      heartbeatRef.current = setInterval(() => {
        if (synth.speaking) {
          synth.pause();
          synth.resume();
        }
      }, 10000);

      const cleanup = () => {
        utteranceRef.current = null;

        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }
      };

      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      synth.speak(utterance);
    },
    [useNativeTTS],
  );

  const speak = useCallback(
    async (rawText: string, options: SpeakOptions = {}) => {
      const text = rawText.trim();

      if (!voiceOn || !isSupported || !text) {
        return;
      }

      if (queueTimeoutRef.current) {
        clearTimeout(queueTimeoutRef.current);
      }

      if (useNativeTTS) {
        void speakNow(text, options);
        return;
      }

      const synth = window.speechSynthesis;

      if (synth.speaking || synth.pending) {
        synth.cancel();

        queueTimeoutRef.current = setTimeout(() => {
          void speakNow(text, options);
        }, 100);
      } else {
        void speakNow(text, options);
      }
    },
    [voiceOn, isSupported, speakNow, useNativeTTS],
  );

  const cancel = useCallback(() => {
    if (!isSupported) {
      return;
    }

    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
    }

    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }

    utteranceRef.current = null;

    if (useNativeTTS) {
      void NativeTTS.stop().catch((error) => {
        console.warn("Native text-to-speech stop failed.", error);
      });
      return;
    }

    window.speechSynthesis.cancel();
  }, [isSupported, useNativeTTS]);

  return {
    speak,
    cancel,
    isSupported,
    voiceOn,
  };
}
