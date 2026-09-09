"use client";

import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { StaticLink } from "@/components/shared/static-link";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { cn } from "@/lib/utils";
import { clampTable, MAX_TABLE, MIN_TABLE, STRIP_MAX_TABLE } from "./config";

const TABLE_NUMBERS = Array.from({ length: STRIP_MAX_TABLE }, (_, index) => index + MIN_TABLE);
const ACCENT = "#37C183";
const DEFAULT_TABLE = 2;

/**
 * The "browse and learn" half of the Times Tables game — pick a number and
 * see its whole multiplication table (1× through 10×) laid out at once,
 * with each row read aloud on tap. `GradeQuizClient` only ever *tests*
 * random facts; this is where a child can actually study a table first,
 * then either practice just that table or mix it back in with every other
 * one — see `TimesTablesPageContent`, which renders this for the plain
 * `/games/times-tables` URL and hands off to the quiz once a mode/table is
 * chosen (`?table=<n>` or `?table=mixed`).
 *
 * The number picker sits in its own bar at the very bottom of the page,
 * `sticky` so it stays within thumb reach while the table/practice content
 * above scrolls — a phone's bottom edge is the easiest one-handed spot for
 * a kid to tap, and this is the control they reach for again and again. A
 * ‹ N › stepper covers "just the next/previous table" in one tap. A
 * compact horizontally-scrolling strip (not a giant grid — that read as a
 * wall of tiny buttons, not something built for quick picking) covers the
 * common 1–100 range (`STRIP_MAX_TABLE`) by browsing, and the type-a-number
 * jump field covers the full range up to `MAX_TABLE` directly, for a
 * number further out than it's worth scrolling to.
 */
export function TimesTablesHub() {
  const [selected, setSelected] = useState(DEFAULT_TABLE);
  const [jumpValue, setJumpValue] = useState("");
  const { speak } = useSpeechSynthesis();
  const stripRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(
    () => Array.from({ length: 10 }, (_, index) => ({ multiplier: index + 1, product: selected * (index + 1) })),
    [selected],
  );

  // Keeps the selected chip in view when `selected` changes via the stepper
  // or the jump field — not just from tapping a chip in the strip directly.
  useEffect(() => {
    const chip = stripRef.current?.querySelector<HTMLElement>(`[data-table-number="${selected}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [selected]);

  function handleJumpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(jumpValue);
    if (Number.isFinite(parsed) && jumpValue.trim() !== "") {
      setSelected(clampTable(parsed));
    }
    setJumpValue("");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h1 className="font-display text-xl font-bold">Table of {selected}</h1>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {rows.map((row) => (
            <li key={row.multiplier}>
              <button
                type="button"
                onClick={() => speak(`${selected} times ${row.multiplier} equals ${row.product}`)}
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-2.5 text-left font-bold transition-colors hover:bg-secondary/70 active:scale-[0.98]"
              >
                <span>
                  {selected} × {row.multiplier} = <span style={{ color: ACCENT }}>{row.product}</span>
                </span>
                <Volume2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <Button asChild size="md" className="flex-1">
          <StaticLink href={`/games/times-tables?table=${selected}`}>Practice table of {selected}</StaticLink>
        </Button>
        <Button asChild variant="outline" size="md" className="flex-1">
          <StaticLink href="/games/times-tables?table=mixed">Mixed practice</StaticLink>
        </Button>
      </div>

      <div className="sticky bottom-3 z-10 rounded-3xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Pick a table
          </p>
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <label htmlFor="times-table-jump" className="sr-only">
              Jump to table number
            </label>
            <input
              id="times-table-jump"
              type="number"
              inputMode="numeric"
              min={MIN_TABLE}
              max={MAX_TABLE}
              placeholder="e.g. 73"
              value={jumpValue}
              onChange={(event) => setJumpValue(event.target.value)}
              className="h-8 w-16 rounded-lg border border-border bg-background px-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <Button type="submit" size="sm" variant="outline" className="h-8 px-3 text-xs">
              Go
            </Button>
          </form>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelected((current) => clampTable(current - 1))}
            disabled={selected <= MIN_TABLE}
            aria-label="Previous table"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-transform active:scale-90 disabled:opacity-40"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <div
            ref={stripRef}
            className="flex flex-1 snap-x gap-1.5 overflow-x-auto scroll-smooth px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABLE_NUMBERS.map((number) => (
              <button
                key={number}
                type="button"
                data-table-number={number}
                onClick={() => setSelected(number)}
                aria-pressed={number === selected}
                className={cn(
                  "flex size-9 shrink-0 scroll-mx-1 snap-center items-center justify-center rounded-full text-sm font-black transition-all active:scale-90",
                  number === selected
                    ? "text-white shadow-md"
                    : "border border-border bg-background text-foreground hover:bg-secondary",
                )}
                style={number === selected ? { backgroundColor: ACCENT } : undefined}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSelected((current) => clampTable(current + 1))}
            disabled={selected >= MAX_TABLE}
            aria-label="Next table"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-transform active:scale-90 disabled:opacity-40"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
