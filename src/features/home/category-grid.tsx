import { BarChart3, Gamepad2, Settings, Sparkles, Target, Trophy } from "lucide-react";
import { categories } from "@/data/categories";
import { CategoryTile } from "./category-tile";
import { SpecialTile } from "./special-tile";

const SPECIAL_TILES = [
  { href: "/quiz", title: "Quiz", subtitle: "Mixed questions", icon: Target, color: "#00B894" },
  { href: "/games", title: "Games", subtitle: "Learning mini games", icon: Gamepad2, color: "#E17055" },
  { href: "/rewards", title: "Rewards", subtitle: "Stars • coins • badges", icon: Trophy, color: "#FDCB6E" },
  { href: "/parents", title: "Parent Progress", subtitle: "Learning report", icon: BarChart3, color: "#0984E3" },
  { href: "/study-coach", title: "Study Coach", subtitle: "Rules • hunt • routine", icon: Sparkles, color: "#6F4EAA" },
  { href: "/settings", title: "Settings", subtitle: "Language • sound", icon: Settings, color: "#636E72" },
] as const;

export function CategoryGrid() {
  return (
    <section aria-labelledby="explore-heading" className="flex flex-col gap-3">
      <h2 id="explore-heading" className="font-display text-lg font-bold">
        Explore &amp; play
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryTile key={category.slug} category={category} />
        ))}
        {SPECIAL_TILES.map((tile) => (
          <SpecialTile key={tile.href} {...tile} />
        ))}
      </div>
    </section>
  );
}
