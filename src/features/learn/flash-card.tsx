"use client";

import type { ReactNode } from "react";
import { Lightbulb, Sparkles, Volume2 } from "lucide-react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivingIcon } from "@/components/shared/living-icon";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { cn } from "@/lib/utils";
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
      className="relative flex size-20 shrink-0 items-center justify-center rounded-full shadow-lg sm:size-28"
      style={tileGradient(accentColor)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-1 h-1/2 rounded-t-full bg-gradient-to-b from-white/35 to-transparent"
      />
      <div className="relative flex size-14 items-center justify-center rounded-full bg-card shadow-inner sm:size-20">
        {children}
      </div>
    </div>
  );
}

export function FlashCard({
  item,
  accentColor,
  className,
}: {
  item: LearningItem;
  accentColor: string;
  /** Extra classes merged onto the card's own root. */
  className?: string;
}) {
  const { speak } = useSpeechSynthesis();
  const t = useTranslation();
  const pronounceText = item.speech || item.label;

  const hasSymbol = Boolean(item.symbol);
  const hasIcon = Boolean(item.icon || item.image);
  // Built once and reused by both places that can render it below (the
  // letter+picture "badge" layout and the picture-only layout) so there's
  // a single spot rendering the actual <img>/emoji, not two copies drifting
  // apart over time.
  const iconMedallion = hasIcon && (
    <IconMedallion accentColor={accentColor}>
      <LivingIcon label={item.label} className="text-2xl sm:text-3xl">
        {item.image ? (
          <img src={item.image} alt="" aria-hidden="true" className="size-8 sm:size-10" />
        ) : (
          <span aria-hidden="true">{item.icon}</span>
        )}
      </LivingIcon>
    </IconMedallion>
  );

  return (
    <div
      className={cn(
        "animate-pop relative flex min-h-[18rem] flex-col items-center justify-between overflow-hidden rounded-3xl border border-border p-5 text-center shadow-xl sm:min-h-[20rem] sm:p-7",
        className,
      )}
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

      <div className="relative flex flex-1 flex-col items-center justify-center gap-2.5">
        {item.visualColor ? (
          <IconMedallion accentColor={item.visualColor}>
            <span
              aria-hidden="true"
              className="size-10 rounded-full sm:size-14"
              style={{ backgroundColor: item.visualColor }}
            />
          </IconMedallion>
        ) : hasSymbol && hasIcon ? (
          // Alphabet/Hindi/Gujarati have both a letter and a picture for the
          // same item — rather than two equally-sized hero elements
          // competing for attention (stacked, or even side by side), the
          // picture is the one thing a young child actually recognizes at a
          // glance, so it stays the star. The letter becomes a small
          // tilted "sticker" badge clipped onto the medallion's edge — a
          // playful comic-book/sticker-sheet look kids respond to, and a
          // clear visual link between "this letter" and "this picture"
          // without needing its own separate hero-sized block.
          <div className="relative inline-flex">
            {iconMedallion}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 -right-1.5 flex size-9 rotate-6 items-center justify-center rounded-full border-4 border-card font-display text-base font-black text-white shadow-md sm:-bottom-2 sm:-right-2 sm:size-11 sm:text-lg"
              style={{ backgroundColor: accentColor }}
            >
              {item.symbol}
            </span>
          </div>
        ) : hasSymbol ? (
          <div className="relative flex items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute size-20 rounded-full blur-2xl sm:size-24"
              style={{ backgroundColor: accentColor, opacity: 0.18 }}
            />
            <span
              className="relative font-display text-4xl font-black sm:text-6xl"
              style={{ color: accentColor }}
            >
              {item.symbol}
            </span>
          </div>
        ) : (
          iconMedallion || null
        )}
        <h2 className="font-display text-xl font-bold sm:text-2xl">{item.label}</h2>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold sm:text-sm"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`, color: accentColor }}
        >
          {item.detail}
        </span>

        {/*
          The "did you know" fact: a bit of real-world knowledge about this
          specific item (e.g. what a lion's family group is called), not
          just its name/pronunciation — see `LearningItem.fact`'s doc for
          why this is separate from `detail` above. Categories without
          facts yet (Numbers, Math, Gujarati, Hindi) simply render nothing
          here rather than an empty/awkward gap.
        */}
        {item.fact && (
          <p className="mt-1 flex max-w-xs items-start gap-1.5 text-left text-xs text-muted-foreground sm:max-w-sm sm:text-sm">
            <Lightbulb
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0 sm:size-4"
              style={{ color: accentColor }}
            />
            <span>{item.fact}</span>
          </p>
        )}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center justify-center gap-3">
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
