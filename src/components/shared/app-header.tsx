import { StaticLink as Link } from "./static-link";
import { StarsPill } from "./stars-pill";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-1.5 font-display text-sm font-bold sm:gap-2 sm:text-base md:text-lg"
        >
          <img
            src="/icons/icon-192.png"
            alt=""
            aria-hidden="true"
            className="size-7 shrink-0 rounded-lg object-contain sm:size-8"
          />
          <span className="truncate">Happy Kids Academy</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <StarsPill />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
