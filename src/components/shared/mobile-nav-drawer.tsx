"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { StaticLink as Link } from "./static-link";

/**
 * Mobile primary navigation: a hamburger button in the header opens a
 * slide-out drawer listing the same destinations the desktop `SideNav`
 * shows. Replaces the old fixed bottom tab bar so the bottom of the screen
 * is free for a future ad banner instead of the two competing for the same
 * space. Hidden on `md:` and up, where `SideNav` is already visible.
 */
export function MobileNavDrawer() {
  const pathname = usePathname();
  const t = useTranslation();

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={t("nav.openMenu")}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out md:hidden" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[80vw] flex-col bg-card p-4 shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left md:hidden"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <DialogPrimitive.Title className="font-display text-lg font-bold">{t("nav.menu")}</DialogPrimitive.Title>
            <DialogPrimitive.Close className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring">
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">{t("nav.closeMenu")}</span>
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
            {NAV_ITEMS.map(({ href, labelKey, icon: Icon, color }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <DialogPrimitive.Close key={href} asChild>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-bold transition-colors",
                      isActive ? "shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                    style={
                      isActive
                        ? { backgroundColor: `color-mix(in srgb, ${color} 14%, var(--card))`, color }
                        : undefined
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        !isActive && "bg-secondary",
                      )}
                      style={isActive ? { backgroundColor: color, color: "white" } : { color }}
                    >
                      <Icon className="size-5" />
                    </span>
                    {t(labelKey)}
                  </Link>
                </DialogPrimitive.Close>
              );
            })}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
