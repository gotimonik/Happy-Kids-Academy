import Link from "next/link";
import { StarsPill } from "./stars-pill";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-display text-base font-bold sm:text-lg"
        >
          <span aria-hidden="true" className="shrink-0 text-2xl">
            🎓
          </span>
          <span className="truncate">Happy Kids Academy</span>
        </Link>
        <div className="flex items-center gap-2">
          <StarsPill />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
