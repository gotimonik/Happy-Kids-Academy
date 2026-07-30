"use client";

import { useCallback, useRef } from "react";
import { useSettingsStore } from "@/store/settings-store";

type AudioContextConstructor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
}

/**
 * Synthesizes a short win chime with the Web Audio API — no audio file needed,
 * mirroring the Android app's `ToneGenerator`-based chime.
 */
export function useChime() {
  const musicOn = useSettingsStore((state) => state.musicOn);
  const contextRef = useRef<AudioContext | null>(null);

  const playWinChime = useCallback(() => {
    if (!musicOn) return;
    const Ctor = getAudioContextConstructor();
    if (!Ctor) return;

    const context = contextRef.current ?? new Ctor();
    contextRef.current = context;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — a bright three-note arpeggio.
    notes.forEach((frequency, index) => {
      const startTime = context.currentTime + index * 0.12;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    });
  }, [musicOn]);

  return { playWinChime };
}
