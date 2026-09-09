"use client";

import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { GradeQuizClient } from "@/features/quiz/grade-quiz-client";
import { MAX_TABLE, MIN_TABLE } from "./config";
import { TimesTablesHub } from "./times-tables-hub";

const ACCENT = "#37C183";

/**
 * Decides what `/games/times-tables` actually shows, driven by its own
 * `?table=` query param (read client-side, so this needs the `Suspense`
 * boundary the page wraps it in):
 *
 * - no param → `TimesTablesHub`, the "pick a number and learn its table" view.
 * - `?table=mixed` → the original random quiz drawing from every table 2–10.
 * - `?table=<n>` (see `MAX_TABLE` in `./config`) → a quiz scoped to just that number's table.
 * - anything malformed/out of range → falls back to the hub rather than
 *   crashing or showing a broken quiz.
 */
export function TimesTablesPageContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");

  if (tableParam === null) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Times Tables" }]} />
        <TimesTablesHub />
      </>
    );
  }

  if (tableParam === "mixed") {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Games", href: "/games" },
            { label: "Times Tables", href: "/games/times-tables" },
            { label: "Mixed Practice" },
          ]}
        />
        <GradeQuizClient
          title="Times Tables"
          accentColor={ACCENT}
          gameId="times-tables"
          recordAgainstCategory="math"
          backHref="/games/times-tables"
        />
      </>
    );
  }

  const parsed = Number(tableParam);
  const validTable = Number.isInteger(parsed) && parsed >= MIN_TABLE && parsed <= MAX_TABLE ? parsed : null;

  if (validTable !== null) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Games", href: "/games" },
            { label: "Times Tables", href: "/games/times-tables" },
            { label: `Table of ${validTable}` },
          ]}
        />
        <GradeQuizClient
          title={`Table of ${validTable}`}
          accentColor={ACCENT}
          gameId="times-tables"
          recordAgainstCategory="math"
          tableNumber={validTable}
          backHref="/games/times-tables"
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: "Times Tables" }]} />
      <TimesTablesHub />
    </>
  );
}
