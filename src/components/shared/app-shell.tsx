import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { BottomNav } from "./bottom-nav";
import { SideNav } from "./side-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 pt-6 md:px-8">
        <SideNav />
        <main id="main-content" className="min-w-0 flex-1 pb-24 md:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
