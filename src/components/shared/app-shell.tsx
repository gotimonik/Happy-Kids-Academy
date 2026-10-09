import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { SideNav } from "./side-nav";
import { SiteFooter } from "./site-footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    // Deliberately no `bg-background` here: this box spans the full
    // viewport in normal document flow, so an opaque fill would paint over
    // (and completely hide) the fixed, negative-z-index `<AnimatedBackground>`
    // blobs/sparkles rendered earlier in `RootLayout` — leaving the app
    // looking like flat, ambient-free color. `body` still carries its own
    // background as the base fill beneath everything.
    //
    // `min-h-dvh` (not `min-h-screen`, i.e. NOT `100vh`) on purpose: `100vh`
    // is measured against the *largest* possible viewport, ignoring the
    // browser's own collapsible chrome (address bar, and on mobile, the
    // media-session bar that can appear the moment audio actually starts
    // playing — e.g. tapping "Pronounce", which is the one button on a
    // flash card that plays real audio rather than just changing state).
    // When that chrome shows/hides, the *visual* viewport height changes
    // but a `100vh` box doesn't, and on a short page the footer sits right
    // where this box ends — so it visibly jumps as the real viewport
    // catches up, looking like the page reloaded even though nothing
    // remounted. `dvh` tracks the browser's actual current viewport instead,
    // so this box (and the footer pinned after it) resizes smoothly with
    // that chrome instead of jumping when it appears/disappears.
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <div
        className="mx-auto flex w-full max-w-6xl flex-1 gap-6 pt-6 [--shell-px:1rem] md:[--shell-px:2rem]"
        // Keeps content clear of the notch in landscape (0 otherwise).
        style={{
          paddingLeft: "max(var(--shell-px), env(safe-area-inset-left))",
          paddingRight: "max(var(--shell-px), env(safe-area-inset-right))",
        }}
      >
        <SideNav />
        <main id="main-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
      {/*
        SiteFooter carries the bottom spacing itself (home-indicator safe
        area + breathing room + ad-banner headroom), so its background runs
        to the very bottom of the screen instead of ending above a
        differently colored spacer.
      */}
      <SiteFooter />
    </div>
  );
}
