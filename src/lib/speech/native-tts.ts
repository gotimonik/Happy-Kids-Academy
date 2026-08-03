"use client";

import { Capacitor, registerPlugin } from "@capacitor/core";

export interface NativeTTSSpeakOptions {
  readonly text: string;
  readonly locale?: string;
  readonly pitch?: number;
  readonly rate?: number;
}

interface NativeTTSPlugin {
  speak(options: NativeTTSSpeakOptions): Promise<void>;
  stop(): Promise<void>;
}

export const NativeTTS = registerPlugin<NativeTTSPlugin>("NativeTTS");

export function isNativeTTSSupported(): boolean {
  return Capacitor.getPlatform() === "android";
}
