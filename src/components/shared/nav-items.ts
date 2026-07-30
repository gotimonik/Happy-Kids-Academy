import type { LucideIcon } from "lucide-react";
import { Gamepad2, Home, Settings, Sparkles, Trophy } from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/rewards", label: "Rewards", icon: Trophy },
  { href: "/study-coach", label: "Coach", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];
