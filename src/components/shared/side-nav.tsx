"use client";

import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/shared/skeleton-card";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { StaticLink as Link } from "./static-link";

/**
 * Same shape as the real nav below, so swapping the two never shifts layout.
 * Each row's `framer-motion` entrance (`initial={{ opacity: 0, x: -8 }}`)
 * renders that invisible starting state inline in the statically-exported
 * HTML — without this, the whole menu would sit blank until React hydrates
 * and starts the animation, which can be a very visible gap on a slow
 * connection/device.
 */
function SideNavSkeleton() {
  return (
    <nav
      aria-busy="true"
      aria-label="Loading menu"
      className="sticky top-20 hidden h-fit w-56 shrink-0 flex-col gap-1 rounded-3xl border border-border bg-card p-3 shadow-md md:flex"
    >
      <div className="flex items-center gap-1.5 px-3 pb-2 pt-1">
        <Skeleton className="size-3.5 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
      {NAV_ITEMS.map((item) => (
        <div key={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-2.5">
          <Skeleton className="size-9 shrink-0 rounded-xl" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <SideNavSkeleton />;

  return (
    <nav
      aria-label="Primary"
      className="sticky top-20 hidden h-fit w-56 shrink-0 flex-col gap-1 rounded-3xl border border-border bg-card p-3 shadow-md md:flex"
    >
      <div className="flex items-center gap-1.5 px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Sparkle className="size-3.5" aria-hidden="true" />
        Menu
      </div>

      {NAV_ITEMS.map(({ href, label, icon: Icon, color }, index) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.25, ease: "easeOut" }}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors",
                isActive ? "shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `color-mix(in srgb, ${color} 14%, var(--card))`,
                      color,
                    }
                  : undefined
              }
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1.5 left-0 w-1 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  !isActive && "bg-secondary",
                )}
                style={
                  isActive
                    ? { backgroundColor: color, color: "white" }
                    : { color }
                }
              >
                <Icon className="size-5" />
              </span>
              {label}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
