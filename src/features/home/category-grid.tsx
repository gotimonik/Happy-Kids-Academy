"use client";

import { BarChart3, Gamepad2, Settings, Sparkles, Target, Trophy } from "lucide-react";
import { categories } from "@/data/categories";
import { useTranslation } from "@/lib/i18n/use-translation";
import type { TranslationKey } from "@/lib/i18n/translations";
import { CategoryTile } from "./category-tile";
import { SpecialTile } from "./special-tile";

const SPECIAL_TILES = [
  { href: "/quiz", titleKey: "home.tile.quizTitle", subtitleKey: "home.tile.quizSubtitle", icon: Target, color: "#00B894" },
  { href: "/games", titleKey: "home.tile.gamesTitle", subtitleKey: "home.tile.gamesSubtitle", icon: Gamepad2, color: "#E17055" },
  { href: "/rewards", titleKey: "home.tile.rewardsTitle", subtitleKey: "home.tile.rewardsSubtitle", icon: Trophy, color: "#FDCB6E" },
  { href: "/parents", titleKey: "home.tile.parentsTitle", subtitleKey: "home.tile.parentsSubtitle", icon: BarChart3, color: "#0984E3" },
  { href: "/study-coach", titleKey: "home.tile.coachTitle", subtitleKey: "home.tile.coachSubtitle", icon: Sparkles, color: "#6F4EAA" },
  { href: "/settings", titleKey: "home.tile.settingsTitle", subtitleKey: "home.tile.settingsSubtitle", icon: Settings, color: "#636E72" },
] satisfies readonly {
  href: string;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  icon: typeof Target;
  color: string;
}[];

export function CategoryGrid() {
  const t = useTranslation();

  return (
    <section aria-labelledby="explore-heading" className="flex flex-col gap-3">
      <h2 id="explore-heading" className="font-display text-lg font-bold">
        {t("home.explorePlay")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryTile key={category.slug} category={category} />
        ))}
        {SPECIAL_TILES.map(({ titleKey, subtitleKey, ...tile }) => (
          <SpecialTile key={tile.href} title={t(titleKey)} subtitle={t(subtitleKey)} {...tile} />
        ))}
      </div>
    </section>
  );
}
