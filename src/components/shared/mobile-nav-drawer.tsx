"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
/** How far in from the left screen edge a touch must start to count as an
 * "open the menu" swipe — narrow enough not to steal ordinary taps/scrolls.
 * On Android with gesture navigation, the system Back gesture owns the left
 * edge; `MainActivity.java` reserves a band of this same width (keep the two
 * in sync: `EDGE_SWIPE_WIDTH_DP`) in the middle of the edge for this swipe. */
const EDGE_ZONE_PX = 24;
/** Movement needed before a touch is treated as a horizontal drag at all. */
const DRAG_SLOP_PX = 8;
/** Release past this fraction of the drawer's width (or flick faster than
 * the velocity below) and it settles open/closed; otherwise it snaps back. */
const SETTLE_FRACTION = 0.4;
const FLICK_VELOCITY_PX_PER_MS = 0.5;
const FLICK_MAX_PAUSE_MS = 100;
const SETTLE_MS = 260;
const SETTLE_TRANSITION = `transform ${SETTLE_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`;
/** Matches Tailwind's `md` breakpoint, where SideNav replaces this drawer. */
const MOBILE_QUERY = "(max-width: 767.98px)";

type Gesture =
  /** Finger is down and the drawer follows it; `progress` 0 (hidden) → 1 (open). */
  | { phase: "dragging"; progress: number }
  /** Finger lifted; drawer is animating to `target` before state commits. */
  | { phase: "settling"; target: 0 | 1 }
  | null;

/** True if the touch began on something that handles its own touch moves
 * (drawing/tracing canvas, drag-and-drop pieces — all `touch-action: none`),
 * so an edge swipe there keeps drawing instead of opening the menu. */
function startsOnTouchSurface(target: EventTarget | null): boolean {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    if (el.hasAttribute("data-no-edge-swipe")) return true;
    if (getComputedStyle(el).touchAction === "none") return true;
    el = el.parentElement;
  }
  return false;
}

/**
 * Mobile primary navigation: a hamburger button in the header opens a
 * slide-out drawer listing the same destinations the desktop `SideNav`
 * shows. Replaces the old fixed bottom tab bar so the bottom of the screen
 * is free for a future ad banner instead of the two competing for the same
 * space. Hidden on `md:` and up, where `SideNav` is already visible.
 *
 * Also opens by swiping right from the left screen edge, and closes by
 * swiping the open drawer back to the left — the drawer (and the backdrop's
 * opacity) tracks the finger 1:1, then eases to open/closed on release
 * depending on how far/fast it was flung. While a gesture owns the drawer's
 * position, Radix's CSS enter/exit keyframes are switched off so they don't
 * replay on top of it; taps on the button/links/backdrop still use them.
 */
export function MobileNavDrawer() {
  const pathname = usePathname();
  const t = useTranslation();

  const [open, setOpen] = useState(false);
  const [gesture, setGesture] = useState<Gesture>(null);
  // Set when the current open/close was driven by a swipe, so the matching
  // Radix keyframe animation is skipped (the swipe already animated it).
  const [swipeDriven, setSwipeDriven] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Commit the result once the settle animation has had time to finish.
  // A timer rather than `transitionend`, which never fires when the finger
  // was released exactly at the target (nothing left to animate) — that
  // would leave an invisible, tap-blocking drawer behind.
  useEffect(() => {
    if (gesture?.phase !== "settling") return;
    const target = gesture.target;
    const timer = window.setTimeout(() => {
      if (target === 0) setOpen(false); // no exit keyframes: swipeDriven is set
      setGesture(null);
    }, SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [gesture]);

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY);
    let track: {
      startX: number;
      startY: number;
      lastX: number;
      lastT: number;
      velocity: number;
      fromOpen: boolean;
      active: boolean;
    } | null = null;

    const width = () => contentRef.current?.offsetWidth ?? Math.min(288, window.innerWidth * 0.8);

    const progressFor = (x: number) => {
      if (!track) return 0;
      const dx = x - track.startX;
      const p = track.fromOpen ? 1 + dx / width() : dx / width();
      return Math.max(0, Math.min(1, p));
    };

    function onTouchStart(e: TouchEvent) {
      if (!mobile.matches || e.touches.length !== 1) return;
      const touch = e.touches[0]!;
      const isOpen = openRef.current;
      if (!isOpen) {
        if (touch.clientX > EDGE_ZONE_PX || startsOnTouchSurface(e.target)) return;
      } else if (!(contentRef.current?.contains(e.target as Node) || touch.clientX > width())) {
        return;
      }
      track = {
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastT: e.timeStamp,
        velocity: 0,
        fromOpen: isOpen,
        active: false,
      };
    }

    function onTouchMove(e: TouchEvent) {
      if (!track) return;
      const touch = e.touches[0]!;
      const dx = touch.clientX - track.startX;
      const dy = touch.clientY - track.startY;

      if (!track.active) {
        if (Math.abs(dx) < DRAG_SLOP_PX && Math.abs(dy) < DRAG_SLOP_PX) return;
        // Mostly vertical (a scroll), or the wrong direction: let it go.
        const rightDirection = track.fromOpen ? dx < 0 : dx > 0;
        if (Math.abs(dy) > Math.abs(dx) || !rightDirection) {
          track = null;
          return;
        }
        track.active = true;
        setSwipeDriven(true);
        if (!track.fromOpen) setOpen(true);
      }

      e.preventDefault(); // stop the page scrolling under the drag
      const dt = Math.max(1, e.timeStamp - track.lastT);
      track.velocity = (touch.clientX - track.lastX) / dt;
      track.lastX = touch.clientX;
      track.lastT = e.timeStamp;
      setGesture({ phase: "dragging", progress: progressFor(touch.clientX) });
    }

    function onTouchEnd(e: TouchEvent) {
      if (!track) return;
      const wasActive = track.active;
      const progress = progressFor(track.lastX);
      // A finger that stopped before lifting isn't a flick, whatever its
      // last movement's speed was.
      const v = e.timeStamp - track.lastT > FLICK_MAX_PAUSE_MS ? 0 : track.velocity;
      track = null;
      if (!wasActive) return;

      let target: 0 | 1;
      if (v > FLICK_VELOCITY_PX_PER_MS) target = 1;
      else if (v < -FLICK_VELOCITY_PX_PER_MS) target = 0;
      else target = progress >= SETTLE_FRACTION ? 1 : 0;
      setGesture({ phase: "settling", target });
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  function handleOpenChange(next: boolean) {
    // Button, link, backdrop or Escape: use the normal keyframe animations.
    setSwipeDriven(false);
    setGesture(null);
    setOpen(next);
  }

  // Drawer position while a gesture owns it; `undefined` hands control back
  // to the stylesheet (resting open, or Radix's keyframes).
  const progress =
    gesture?.phase === "dragging" ? gesture.progress : gesture?.phase === "settling" ? gesture.target : undefined;
  const contentMotion: CSSProperties =
    progress === undefined
      ? {}
      : {
          transform: `translate3d(${(progress - 1) * 100}%, 0, 0)`,
          transition: gesture?.phase === "settling" ? SETTLE_TRANSITION : "none",
        };
  const overlayMotion: CSSProperties =
    progress === undefined
      ? {}
      : {
          opacity: progress,
          transition: gesture?.phase === "settling" ? `opacity ${SETTLE_MS}ms ease-out` : "none",
        };
  // Keyframes are off whenever a swipe is (or was, for this open) in control.
  const keyframes = !swipeDriven;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
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
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 md:hidden",
            keyframes &&
              "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
          )}
          style={overlayMotion}
        />
        <DialogPrimitive.Content
          ref={contentRef}
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            // Opened by a swipe (no tap on a control), the browser would
            // treat focusing the close button as keyboard focus and draw its
            // focus ring. Focus the drawer itself instead — still moves focus
            // into the dialog for screen readers, without the ring.
            if (swipeDriven) {
              e.preventDefault();
              contentRef.current?.focus({ preventScroll: true });
            }
          }}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[80vw] flex-col bg-card p-4 shadow-2xl outline-none will-change-transform md:hidden",
            keyframes &&
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left",
          )}
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
            ...contentMotion,
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
