import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
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
 * see src/app/progress) plus a short invite message, degrading gracefully:
 *  1. In the native Android app, `@capacitor/share`'s `Share.share()`, which
 *     invokes the real Android share sheet (WhatsApp, Messages, Gmail, …).
 *     `navigator.share` is *not* used here — the WebView Capacitor renders
 *     the app in generally doesn't implement the Web Share API, so calling
 *     it there used to silently fall through to the clipboard-only path
 *     below with no share sheet ever appearing.
 *  2. On the web, `navigator.share` with `text` + `url` where the browser
 *     supports it. This is the whole point of moving off the old
 *     image-attachment share: a link is a real page in the app, so when
 *     someone opens it, that visit shows up in analytics — an attached
 *     image opened in a chat app was invisible to us.
 *  3. Copy the message + link to the clipboard, so it can still be pasted
 *     anywhere by hand — the final fallback for browsers with neither.
 */
export async function shareProgress(data: ProgressShareData): Promise<ShareOutcome> {
  const url = buildProgressUrl(data);
  const message = shareMessage(data);

  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title: "My Happy Kids Academy progress",
        text: message,
        url,
        dialogTitle: "Share my progress",
      });
      return "shared";
    } catch (error) {
      // The user backed out of the native share sheet — Android reports
      // this as a rejected promise, not a DOM AbortError.
      if (error instanceof Error && /cancel/i.test(error.message)) return "cancelled";
      // Otherwise fall through to the clipboard fallback below.
    }
  } else if (typeof navigator !== "undefined" && navigator.share) {
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
