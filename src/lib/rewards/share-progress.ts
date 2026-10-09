import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { requestParentalGate } from "@/lib/parental-gate/request-parental-gate";
import { PROGRESS_CARD_FILENAME, type ProgressCard } from "./progress-card";
import { buildProgressPath, type ProgressShareData } from "./progress-url";

// Same fallback pattern used in layout.tsx / robots.ts / sitemap.ts / json-ld.ts.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.playfantacy.com";

export type { ProgressShareData };

/** Full, absolute URL to this kid's public progress page. */
export function buildProgressUrl(data: ProgressShareData): string {
  return `${SITE_URL}${buildProgressPath(data)}`;
}

/** Caption sent with the progress-card image. */
export function shareMessage(data: ProgressShareData): string {
  return `I've earned ${data.stars} ⭐ and reached Level ${data.level} on Happy Kids Academy! Come learn and play with me — it's free, works offline, and there are no ads or accounts.`;
}

/** Fallback text when no image can be shared: the message plus a link to the public progress page. */
function linkMessage(data: ProgressShareData): string {
  return `I've earned ${data.stars} ⭐ and reached Level ${data.level} on Happy Kids Academy! Come see my progress and play with me — it's free, works offline, and there are no ads or accounts.`;
}

const SHARE_TITLE = "My Happy Kids Academy progress";

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

function isCancel(error: unknown): boolean {
  // Native share sheets (Android/iOS) reject with "Share canceled"; browsers
  // throw a DOM AbortError when the person backs out.
  return error instanceof Error && (error.name === "AbortError" || /cancel/i.test(error.message));
}

/**
 * Shares the child's progress as an IMAGE — the progress card from
 * `renderProgressCard` (logo, level, stars, coins, badges, lessons) — with a
 * short invite message as its caption. No link is sent with it.
 *
 * `card` should be rendered ahead of time (`ShareProgressButton` does this
 * when it mounts): on the web, `navigator.share` only works while the tap
 * that triggered it is still "fresh", so there's no time to draw the image
 * after the tap.
 *
 * Degrades gracefully, in order:
 *  1. Native app (iOS/Android): the card is written to the app's cache
 *     folder and handed to the native share sheet via `@capacitor/share`
 *     (`navigator.share` isn't reliable inside the WebView). On iOS the
 *     parental gate comes first (Kids Category).
 *  2. Web: `navigator.share` with the image file, where the browser can
 *     share files (most mobile browsers).
 *  3. No image possible (card failed to render, or the browser can't share
 *     files): the previous behavior — share/copy the message plus a link to
 *     the public progress page (src/app/progress).
 */
export async function shareProgress(data: ProgressShareData, card: ProgressCard | null): Promise<ShareOutcome> {
  // iOS (Kids Category): the share sheet sends this out of the app, so a
  // grown-up has to pass the parental gate first. No-op elsewhere.
  if (!(await requestParentalGate())) return "cancelled";

  const url = buildProgressUrl(data);
  const message = shareMessage(data);

  if (Capacitor.isNativePlatform()) {
    try {
      if (card) {
        const { Filesystem, Directory } = await import("@capacitor/filesystem");
        const { uri } = await Filesystem.writeFile({
          path: PROGRESS_CARD_FILENAME,
          data: card.dataUrl.slice(card.dataUrl.indexOf(",") + 1),
          directory: Directory.Cache,
        });
        await Share.share({ title: SHARE_TITLE, text: message, files: [uri], dialogTitle: "Share my progress" });
      } else {
        await Share.share({ title: SHARE_TITLE, text: linkMessage(data), url, dialogTitle: "Share my progress" });
      }
      return "shared";
    } catch (error) {
      if (isCancel(error)) return "cancelled";
      // Otherwise fall through to the clipboard fallback below.
    }
  } else if (typeof navigator !== "undefined" && navigator.share) {
    if (card && navigator.canShare?.({ files: [card.file] })) {
      try {
        await navigator.share({ title: SHARE_TITLE, text: message, files: [card.file] });
        return "shared";
      } catch (error) {
        if (isCancel(error)) return "cancelled";
        // Fall through to the link share below.
      }
    }
    try {
      await navigator.share({ title: SHARE_TITLE, text: linkMessage(data), url });
      return "shared";
    } catch (error) {
      if (isCancel(error)) return "cancelled";
      // Some browsers report share support but still throw for other
      // reasons — the clipboard fallback below is still worth trying.
    }
  }

  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) return "failed";
    await navigator.clipboard.writeText(`${linkMessage(data)}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
