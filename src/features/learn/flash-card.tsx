"use client";

import type { ReactNode } from "react";
import { Sparkles, Volume2 } from "lucide-react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivingIcon } from "@/components/shared/living-icon";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { tileGradient } from "@/lib/ui/tile-gradient";
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

/**
 * A "coin" frame around the item's picture — a rich gradient ring (matching
 * the category's accent color, same technique as `RewardStatCard`) with a
 * plain white/card disc inset so the actual icon/image always reads clearly
 * regardless of its own colors, instead of sitting bare on the card.
 */
function IconMedallion({ accentColor, children }: { accentColor: string; children: ReactNode }) {
  return (
    <div
      className="relative flex size-32 shrink-0 items-center justify-center rounded-full shadow-lg sm:size-36"
      style={tileGradient(accentColor)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-1 h-1/2 rounded-t-full bg-gradient-to-b from-white/35 to-transparent"
      />
      <div className="relative flex size-24 items-center justify-center rounded-full bg-card shadow-inner sm:size-28">
        {children}
      </div>
    </div>
  );
}

export function FlashCard({ item, accentColor }: { item: LearningItem; accentColor: string }) {
  const { speak } = useSpeechSynthesis();
  const t = useTranslation();
  const pronounceText = item.speech || item.label;

  return (
    <div
      className="animate-pop relative flex min-h-[22rem] flex-col items-center justify-between overflow-hidden rounded-3xl border border-border p-6 text-center shadow-xl sm:min-h-[26rem] sm:p-10"
    >
      <span
        aria-hidden="true"
        className="absolute -right-12 -top-14 size-40 rounded-full sm:size-48"
        style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 16%, transparent)` }}
      />
      <span
        aria-hidden="true"
        className="absolute -left-14 -bottom-16 size-40 rounded-full blur-md sm:size-48"
        style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}
      />
      <Sparkles
        aria-hidden="true"
        className="animate-twinkle absolute left-5 top-5 size-5 sm:size-6"
        style={{ color: accentColor, animationDelay: "0.4s" }}
      />
      <Sparkles
        aria-hidden="true"
        className="animate-twinkle absolute bottom-24 right-6 size-4 sm:size-5"
        style={{ color: accentColor, animationDelay: "1.4s" }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
        {item.visualColor ? (
          <IconMedallion accentColor={item.visualColor}>
            <span
              aria-hidden="true"
              className="size-16 rounded-full sm:size-20"
              style={{ backgroundColor: item.visualColor }}
            />
          </IconMedallion>
        ) : (
          <>
            {item.symbol && (
              <div className="relative flex items-center justify-center">
                {!(item.icon || item.image) && (
                  <span
                    aria-hidden="true"
                    className="absolute size-28 rounded-full blur-2xl sm:size-32"
                    style={{ backgroundColor: accentColor, opacity: 0.18 }}
                  />
                )}
                <span
                  className="relative font-display text-6xl font-black sm:text-8xl"
                  style={{ color: accentColor }}
                >
                  {item.symbol}
                </span>
              </div>
            )}
            {(item.image || item.icon) && (
              <IconMedallion accentColor={accentColor}>
                <LivingIcon label={item.label} className="text-4xl sm:text-5xl">
                  {item.image ? (
                    <img src={item.image} alt="" aria-hidden="true" className="size-14 sm:size-16" />
                  ) : (
                    <span aria-hidden="true">{item.icon}</span>
                  )}
                </LivingIcon>
              </IconMedallion>
            )}
          </>
        )}
        <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{item.label}</h2>
        <span
          className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold sm:text-sm"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`, color: accentColor }}
        >
          {item.detail}
        </span>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
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
          size="md"
          accentColor={accentColor}
          style={tileGradient(accentColor)}
          className="text-white hover:brightness-110"
          onClick={() =>
            speak(pronounceText, { locale: localeForSpeechText(pronounceText) })
          }
        >
          <Volume2 className="size-5" aria-hidden="true" />
          {t("learn.pronounce")}
        </Button>
      </div>
    </div>
  );
}
