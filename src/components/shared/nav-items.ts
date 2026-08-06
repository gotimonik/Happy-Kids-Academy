import type { LucideIcon } from "lucide-react";
import { Gamepad2, Home, Settings, Sparkles, Trophy } from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
  /** Per-item accent color — matches the corresponding home page tile (see `SPECIAL_TILES`). */
  readonly color: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home", icon: Home, color: "#6C5CE7" },
  { href: "/games", label: "Games", icon: Gamepad2, color: "#E17055" },
  { href: "/rewards", label: "Rewards", icon: Trophy, color: "#FDCB6E" },
  { href: "/study-coach", label: "Coach", icon: Sparkles, color: "#6F4EAA" },
  { href: "/settings", label: "Settings", icon: Settings, color: "#636E72" },
];
