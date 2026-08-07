import { Sparkles } from "lucide-react";
import { heroGradient } from "@/lib/ui/tile-gradient";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { StaticLink as Link } from "./static-link";
import { StarsPill } from "./stars-pill";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header
      className="sticky top-0 z-30 overflow-hidden text-white shadow-md"
      style={heroGradient()}
    >
      <span aria-hidden="true" className="absolute -right-10 -top-16 size-40 rounded-full bg-white/10" />
      <span aria-hidden="true" className="absolute -left-10 -bottom-16 size-32 rounded-full bg-black/10 blur-md" />

      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <MobileNavDrawer />
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-1.5 font-display text-sm font-bold sm:gap-2 sm:text-base md:text-lg"
          >
            <img
              src="/icons/icon-192.png"
              alt=""
              aria-hidden="true"
              className="size-7 shrink-0 rounded-lg object-contain shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:size-8"
            />
            <span className="truncate">Happy Kids Academy</span>
            <Sparkles className="hidden size-4 shrink-0 text-white/70 sm:block" aria-hidden="true" />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <StarsPill />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
