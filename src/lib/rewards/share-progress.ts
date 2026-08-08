import { buildProgressPath, type ProgressShareData } from "./progress-url";

// Same fallback pattern used in layout.tsx / robots.ts / sitemap.ts / json-ld.ts.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.playfantacy.com";

export type { ProgressShareData };

/** Full, absolute URL to this kid's public progress page. */
export function buildProgressUrl(data: ProgressShareData): string {
  return `${SITE_URL}${buildProgressPath(data)}`;
}

export function shareMessage(data: ProgressShareData): string {
  return `I've earned ${data.stars} ⭐ and reached Level ${data.level} on Happy Kids Academy! Come see my progress and play with me — it's free, works offline, and there are no ads or accounts.`;
}

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/**
 * Shares a link to this kid's public progress page (a real, navigable page —
 * see src/app/progress) plus a short invite message, degrading gracefully
 * since `navigator.share` isn't guaranteed — most desktop browsers lack it:
 *  1. `navigator.share` with `text` + `url`. This is the whole point of
 *     moving off the old image-attachment share: a link is a real page in
 *     the app, so when someone opens it, that visit shows up in analytics —
 *     an attached image opened in a chat app was invisible to us.
 *  2. Copy the message + link to the clipboard, so it can still be pasted
 *     anywhere by hand.
 */
export async function shareProgress(data: ProgressShareData): Promise<ShareOutcome> {
  const url = buildProgressUrl(data);
  const message = shareMessage(data);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: "My Happy Kids Academy progress", text: message, url });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return "cancelled";
      // Some browsers report share support but still throw for other
      // reasons — the clipboard fallback below is still worth trying.
    }
  }

  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) return "failed";
    await navigator.clipboard.writeText(`${message}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
