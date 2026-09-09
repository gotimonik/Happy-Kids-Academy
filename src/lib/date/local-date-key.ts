/**
 * "YYYY-MM-DD" for `date` in the *device's local* timezone — deliberately
 * not `toISOString()`, which is UTC and would flip to the next/previous day
 * for anyone west/east of UTC at certain hours. A streak's "day" has to
 * match the day the child actually experiences on their own device.
 */
export function localDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** `date` shifted by `days` (negative goes backward), preserving local wall-clock semantics (handles month/year rollover via `Date`'s own normalization). */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** The `count` local date keys ending today (oldest first) — e.g. `count=7` for a "last 7 days" strip. */
export function lastNDateKeys(count: number, today: Date = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => localDateKey(addDays(today, index - (count - 1))));
}
