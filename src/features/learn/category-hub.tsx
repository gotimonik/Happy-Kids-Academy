"use client";

import { motion } from "framer-motion";
import { BookOpen, PenLine, Star, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StaticLink as Link } from "@/components/shared/static-link";
import { SegmentedToggle } from "@/components/shared/segmented-toggle";
import { useDisplayCategory } from "@/lib/categories/use-display-category";
import { tileGradient } from "@/lib/ui/tile-gradient";
import { useProgressStore } from "@/store/progress-store";
import { useSettingsStore } from "@/store/settings-store";
import type { LearningCategory } from "@/types/category";
import type { LearningItem } from "@/types/item";

// Reuse the same accent colors as the home page's Quiz / Games tiles
// (see `features/home/category-grid.tsx`) so a category's action tiles feel
// like part of the same family instead of introducing new one-off colors.
const QUIZ_COLOR = "#00B894";
const PRACTICE_COLOR = "#E17055";

interface ActionTile {
  readonly href: string;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: LucideIcon;
  readonly color: string;
  readonly wide?: boolean;
}

/** A small emoji / color swatch / short glyph to tease what's inside a category — skips items with nothing snappy to show (e.g. multi-character math expressions). */
function previewChip(item: LearningItem): { kind: "emoji" | "swatch" | "glyph"; value: string } | null {
  if (item.icon) return { kind: "emoji", value: item.icon };
  if (item.visualColor) return { kind: "swatch", value: item.visualColor };
  if (item.symbol && item.symbol.length <= 3) return { kind: "glyph", value: item.symbol };
  return null;
}

function ActionCard({ tile, index }: { tile: ActionTile; index: number }) {
  const Icon = tile.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={tile.wide ? "sm:col-span-2" : undefined}
    >
      <Link
        href={tile.href}
        className="group relative flex min-h-28 items-center gap-4 overflow-hidden rounded-3xl p-5 text-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:min-h-32"
        style={tileGradient(tile.color)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute -right-6 -top-8 size-28 rounded-full bg-white/15 transition-transform group-hover:scale-110"
        />
        <span aria-hidden="true" className="absolute -left-8 -bottom-10 size-28 rounded-full bg-black/10 blur-md" />
        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <span className="relative">
          <span className="block font-display text-lg font-bold drop-shadow-sm sm:text-xl">{tile.title}</span>
          <span className="block text-sm text-white/85">{tile.subtitle}</span>
        </span>
      </Link>
    </motion.div>
  );
}

export function CategoryHub({ category }: { category: LearningCategory }) {
  const stars = useProgressStore((state) => state.starsByCategory[category.slug] ?? 0);
  const alphabetCase = useSettingsStore((state) => state.alphabetCase);
  const numberScript = useSettingsStore((state) => state.numberScript);
  const setAlphabetCase = useSettingsStore((state) => state.setAlphabetCase);
  const setNumberScript = useSettingsStore((state) => state.setNumberScript);
  const displayCategory = useDisplayCategory(category);

  const tiles: ActionTile[] = [
    {
      href: `/learn/${category.slug}/lesson`,
      title: "Learn",
      subtitle: `Explore ${category.items.length} cards`,
      icon: BookOpen,
      color: category.color,
    },
    {
      href: `/learn/${category.slug}/quiz`,
      title: "Play Quiz",
      subtitle: "10 fun questions",
      icon: Target,
      color: QUIZ_COLOR,
    },
  ];

  if (category.trace) {
    tiles.push({
      href: `/learn/${category.slug}/practice`,
      title: "Writing Practice",
      subtitle: "Trace and draw",
      icon: PenLine,
      color: PRACTICE_COLOR,
      wide: true,
    });
  }

  const preview = displayCategory.items
    .map((item) => previewChip(item))
    .filter((chip): chip is NonNullable<typeof chip> => chip !== null)
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-5">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
        style={tileGradient(category.color)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span aria-hidden="true" className="absolute -right-10 -top-12 size-40 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute -left-12 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />

        <div className="relative flex items-start justify-between gap-3">
          <span aria-hidden="true" className="animate-float text-5xl font-black drop-shadow-sm sm:text-6xl">
            {category.icon}
          </span>
          {stars > 0 && (
            <span
              className="flex items-center gap-0.5 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm"
              aria-label={`${stars} of 3 stars earned in this category`}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <Star
                  key={i}
                  className={i < stars ? "size-4 fill-current" : "size-4 fill-current opacity-30"}
                  aria-hidden="true"
                />
              ))}
            </span>
          )}
        </div>

        <h1 className="relative mt-3 font-display text-2xl font-bold sm:text-3xl">{category.title}</h1>
        <p className="relative mt-1 text-white/85">{category.subtitle}</p>

        {category.slug === "alphabet" && (
          <div className="relative mt-4">
            <SegmentedToggle
              aria-label="Letter style"
              color={category.color}
              value={alphabetCase}
              onChange={setAlphabetCase}
              options={[
                { value: "single", label: "A" },
                { value: "double", label: "Aa" },
              ]}
            />
          </div>
        )}
        {category.slug === "numbers" && (
          <div className="relative mt-4">
            <SegmentedToggle
              aria-label="Number script"
              color={category.color}
              value={numberScript}
              onChange={setNumberScript}
              options={[
                { value: "english", label: "123" },
                { value: "gujarati", label: "૧૨૩" },
              ]}
            />
          </div>
        )}

        {preview.length > 0 && (
          <div className="relative mt-5 flex flex-wrap gap-2" aria-hidden="true">
            {preview.map((chip, index) => (
              <span
                key={index}
                className="animate-pop flex size-10 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur-sm sm:size-11"
                style={{ animationDelay: `${index * 40}ms`, animationFillMode: "backwards" }}
              >
                {chip.kind === "swatch" ? (
                  <span
                    className="size-6 rounded-full border-2 border-white/50"
                    style={{ backgroundColor: chip.value }}
                  />
                ) : (
                  chip.value
                )}
              </span>
            ))}
          </div>
        )}
      </motion.header>

      <div className="grid gap-3 sm:grid-cols-2">
        {tiles.map((tile, index) => (
          <ActionCard key={tile.href} tile={tile} index={index} />
        ))}
      </div>
    </div>
  );
}
