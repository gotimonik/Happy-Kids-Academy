import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { SideNav } from "./side-nav";
import { SiteFooter } from "./site-footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
