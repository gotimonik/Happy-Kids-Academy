"use client";

import { Volume2 } from "lucide-react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import type { LearningItem } from "@/types/item";
import { LANGUAGE_LOCALES } from "@/types/settings";

function localeForSpeechText(text: string): string {
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

export function FlashCard({ item, accentColor }: { item: LearningItem; accentColor: string }) {
  const { speak } = useSpeechSynthesis();
  const pronounceText = item.speech || item.label;

  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-between rounded-3xl border border-border bg-card p-6 text-center shadow-lg sm:min-h-[26rem] sm:p-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        {item.visualColor ? (
          <span
            aria-hidden="true"
            className="size-28 rounded-full border-4 border-black/5 shadow-inner sm:size-32"
            style={{ backgroundColor: item.visualColor }}
          />
        ) : (
          <>
            {item.symbol && (
              <span
                className="font-display text-6xl font-black sm:text-8xl"
                style={{ color: accentColor }}
              >
                {item.symbol}
              </span>
            )}
            {item.icon && (
              <span aria-hidden="true" className="text-5xl sm:text-6xl">
                {item.icon}
              </span>
            )}
          </>
        )}
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{item.label}</h2>
        <p className="text-sm text-muted-foreground sm:text-base">{item.detail}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {item.sound && (
          <Button
          type="button"
          variant="outline"
          size="lg"
            onClick={() => speak(item.sound ?? "", { locale: LANGUAGE_LOCALES.en, rate: 0.75, pitch: 0.85 })}
          >
            <Music className="size-5" aria-hidden="true" />
            {item.sound}
          </Button>
        )}
        <Button
          type="button"
          size="lg"
          style={{ backgroundColor: accentColor }}
          className="text-white hover:brightness-110"
          onClick={() =>
            speak(pronounceText, { locale: localeForSpeechText(pronounceText) })
          }
        >
          <Volume2 className="size-5" aria-hidden="true" />
          Pronounce
        </Button>
      </div>
    </div>
  );
}
