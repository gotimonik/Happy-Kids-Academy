import type { MetadataRoute } from "next";
import { getAllCategorySlugs, getCategory } from "@/data/categories";
import { GAME_REGISTRY } from "@/features/games/game-registry";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.playfantacy.com";

const STATIC_ROUTES = [
  "",
  "/quiz",
  "/games",
  "/rewards",
  "/parents",
  "/study-coach",
  "/study-coach/game-variations",
  "/study-coach/treasure-hunt",
  "/study-coach/daily-routine",
  "/settings",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getAllCategorySlugs().flatMap((slug) => {
    const category = getCategory(slug);
    const base = `${siteUrl}/learn/${slug}`;
    const entries: MetadataRoute.Sitemap = [
      { url: base, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
      { url: `${base}/lesson`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${base}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ];
    if (category?.trace) {
      entries.push({ url: `${base}/practice`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
    return entries;
  });

  const gameEntries: MetadataRoute.Sitemap = GAME_REGISTRY.filter((game) => game.href.startsWith("/games/")).map(
    (game) => ({
      url: `${siteUrl}${game.href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...categoryEntries, ...gameEntries];
}
