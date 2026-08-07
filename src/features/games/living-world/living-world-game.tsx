"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CloudRain, Cloud, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivingIcon } from "@/components/shared/living-icon";
import { vibrate } from "@/lib/haptics/vibrate";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { cn } from "@/lib/utils";
import { LIVING_WORLD_CAST, type TimeOfDay, type Weather } from "./reactions";

const RAINDROP_COUNT = 12;
// Deterministic layout (no Math.random) so server- and client-render match exactly.
const RAINDROPS = Array.from({ length: RAINDROP_COUNT }, (_, i) => ({
  id: i,
  left: (i * 8.4) % 100,
  delay: (i % 6) * 0.22,
}));

function sceneClassName(timeOfDay: TimeOfDay): string {
  return timeOfDay === "day"
    ? "bg-gradient-to-b from-sky-300 to-amber-50"
    : "bg-gradient-to-b from-indigo-950 to-violet-900";
}

/**
 * Living World — Sleepy Animals + Rain Mode combined into one scene. A child
 * toggles day/night and clear/rain; a small cast of animals reacts
 * differently to each combination (ducks love rain, owls wake at night),
 * teaching day/night and weather behavior through play rather than a quiz.
 */
export function LivingWorldGame() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [weather, setWeather] = useState<Weather>("clear");
  const { speak } = useSpeechSynthesis();

  const reactionKey = `${timeOfDay}-${weather}` as const;

  const starPositions = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ id: i, left: (i * 23.7) % 100, top: (i * 13.3) % 70 })),
    [],
  );

  function toggleTimeOfDay() {
    const next: TimeOfDay = timeOfDay === "day" ? "night" : "day";
    setTimeOfDay(next);
    speak(next === "night" ? "Good night! The stars are out." : "Good morning! The sun is up.");
    vibrate(20);
  }

  function toggleWeather() {
    const next: Weather = weather === "clear" ? "rain" : "clear";
    setWeather(next);
    speak(next === "rain" ? "Uh oh, it's starting to rain!" : "The rain has stopped — clear skies again.");
    vibrate(20);
  }

  function tapAnimal(label: string, reaction: string) {
    speak(`${label}. ${reaction}`);
    vibrate(15);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="outline" size="lg" onClick={toggleTimeOfDay}>
          {timeOfDay === "day" ? (
            <>
              <Sun className="size-5" aria-hidden="true" />
              Day
            </>
          ) : (
            <>
              <Moon className="size-5" aria-hidden="true" />
              Night
            </>
          )}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={toggleWeather}>
          {weather === "clear" ? (
            <>
              <Cloud className="size-5" aria-hidden="true" />
              Clear
            </>
          ) : (
            <>
              <CloudRain className="size-5" aria-hidden="true" />
              Rain
            </>
          )}
        </Button>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border p-6 shadow-lg transition-colors duration-700 sm:p-8",
          sceneClassName(timeOfDay),
        )}
      >
        {timeOfDay === "night" && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {starPositions.map((star) => (
              <span
                key={star.id}
                className="absolute size-1 rounded-full bg-white/80"
                style={{ left: `${star.left}%`, top: `${star.top}%` }}
              />
            ))}
          </div>
        )}

        {weather === "rain" && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 motion-reduce:hidden">
            {RAINDROPS.map((drop) => (
              <motion.span
                key={drop.id}
                className="absolute top-0 block h-6 w-0.5 rounded-full bg-sky-100/70"
                style={{ left: `${drop.left}%` }}
                initial={{ y: "-10%", opacity: 0 }}
                animate={{ y: "320%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: drop.delay, ease: "linear" }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {LIVING_WORLD_CAST.map((animal) => {
            const reaction = animal.reactions[reactionKey];
            return (
              <button
                key={animal.id}
                type="button"
                onClick={() => tapAnimal(animal.label, reaction)}
                aria-label={`${animal.label}: ${reaction}`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-ring",
                  timeOfDay === "day" ? "border-black/10 bg-white/80" : "border-white/10 bg-white/10 text-white",
                )}
              >
                <LivingIcon label={animal.label} className="text-4xl sm:text-5xl">
                  <span aria-hidden="true">{animal.icon}</span>
                </LivingIcon>
                <span className="text-sm font-bold">{animal.label}</span>
                <span className={cn("text-xs", timeOfDay === "day" ? "text-muted-foreground" : "text-white/80")}>
                  {reaction}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Tap the sun, the cloud, or any animal to see what happens.
      </p>
    </div>
  );
}
