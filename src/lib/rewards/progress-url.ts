export interface ProgressShareData {
  level: number;
  stars: number;
  coins: number;
  badges: number;
  lessonsCompleted: number;
}

// Short, stable query keys — these end up in a URL a kid's parent might paste
// into a chat app, so keeping them terse (and never renaming them later)
// matters more than readability here.
const PARAM_KEYS = {
  level: "level",
  stars: "stars",
  coins: "coins",
  badges: "badges",
  lessonsCompleted: "lessons",
} as const;

/**
 * Builds the path (no origin) of a shareable, public "progress page" with a
 * snapshot of a kid's stats encoded directly in the query string. There's no
 * backend and no accounts in this app, so a URL is the only way to make a
 * link "about" a specific kid's progress — nothing is looked up server-side,
 * and because anyone could hand-edit the numbers in the link, this is a
 * friendly recap to share with friends/family, not a verified record.
 */
export function buildProgressPath(data: ProgressShareData): string {
  const params = new URLSearchParams({
    [PARAM_KEYS.level]: String(Math.max(0, Math.round(data.level))),
    [PARAM_KEYS.stars]: String(Math.max(0, Math.round(data.stars))),
    [PARAM_KEYS.coins]: String(Math.max(0, Math.round(data.coins))),
    [PARAM_KEYS.badges]: String(Math.max(0, Math.round(data.badges))),
    [PARAM_KEYS.lessonsCompleted]: String(Math.max(0, Math.round(data.lessonsCompleted))),
  });
  return `/progress?${params.toString()}`;
}

function parseCountParam(params: URLSearchParams, key: string): number {
  const raw = params.get(key);
  if (!raw) return 0;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

/**
 * Parses stats back out of a progress page's query string. Returns `null`
 * when there's nothing to show — e.g. someone opens `/progress` directly
 * with no query string — so the page can fall back to a generic invite
 * instead of showing an all-zeroes card.
 */
export function parseProgressParams(params: URLSearchParams): ProgressShareData | null {
  const hasAnyStat = Object.values(PARAM_KEYS).some((key) => params.has(key));
  if (!hasAnyStat) return null;

  return {
    level: parseCountParam(params, PARAM_KEYS.level) || 1,
    stars: parseCountParam(params, PARAM_KEYS.stars),
    coins: parseCountParam(params, PARAM_KEYS.coins),
    badges: parseCountParam(params, PARAM_KEYS.badges),
    lessonsCompleted: parseCountParam(params, PARAM_KEYS.lessonsCompleted),
  };
}
