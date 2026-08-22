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
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 pt-6 md:px-8">
        <SideNav />
        <main id="main-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
      <SiteFooter />
      {/*
        Now that nothing is pinned to the bottom of the screen (nav moved into
        the header), this just keeps the very last thing on the page off the
        device edge — home-indicator safe area on iOS/Android, plus a little
        breathing room. Also leaves headroom for a future ad banner so it
        won't immediately butt up against the footer once one's added.
      */}
      <div style={{ height: "calc(env(safe-area-inset-bottom) + 2.5rem)" }} />
    </div>
  );
}
