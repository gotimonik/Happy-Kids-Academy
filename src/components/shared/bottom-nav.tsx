"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { StaticLink as Link } from "./static-link";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-border bg-card/95 shadow-[0_-6px_20px_rgba(0,0,0,0.09)] backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around px-1 pt-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, color }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="relative flex-1">
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-1/2 top-0 h-1 w-8 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-16 flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-bold"
              >
                <motion.span
                  aria-hidden="true"
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-2xl transition-colors",
                    !isActive && "text-muted-foreground",
                  )}
                  style={
                    isActive
                      ? { backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`, color }
                      : undefined
                  }
                >
                  <Icon className="size-5" />
                </motion.span>
                <span
                  className={cn("transition-colors", !isActive && "text-muted-foreground")}
                  style={isActive ? { color } : undefined}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
