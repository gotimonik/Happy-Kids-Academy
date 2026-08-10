import type { LucideIcon } from "lucide-react";
import { Gamepad2, Home, Settings, Sparkles, Trophy } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n/translations";

export interface NavItem {
  readonly href: string;
  /** Resolved through `useTranslation()` by the nav components, not shown as-is. */
  readonly labelKey: TranslationKey;
  readonly icon: LucideIcon;
  /** Per-item accent color — matches the corresponding home page tile (see `SPECIAL_TILES`). */
  readonly color: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelKey: "nav.home", icon: Home, color: "#6C5CE7" },
  { href: "/games", labelKey: "nav.games", icon: Gamepad2, color: "#E17055" },
  { href: "/rewards", labelKey: "nav.rewards", icon: Trophy, color: "#FDCB6E" },
  { href: "/study-coach", labelKey: "nav.coach", icon: Sparkles, color: "#6F4EAA" },
  { href: "/settings", labelKey: "nav.settings", icon: Settings, color: "#636E72" },
];
