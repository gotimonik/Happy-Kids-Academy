"use client";

import { Capacitor } from "@capacitor/core";

/**
 * Saves a base64 PNG data URL to the user's device, picking the right
 * strategy for where the app is actually running:
 *
 * - **Installed native app (Capacitor Android/iOS):** a plain `<a download>`
 *   pointed at a `data:` URL does nothing here — the WebView has no
 *   download handler registered for `data:` URIs, so tapping the link is a
 *   silent no-op. Instead we write the PNG to the filesystem and hand it to
 *   the native share sheet, which has "Save image" / "Save to Photos" as one
 *   of its built-in targets.
 * - **Mobile browser (Safari/Chrome):** the Web Share API (with files) opens
 *   that same kind of native share sheet, which is far more reliable than an
 *   anchor's `download` attribute — iOS Safari in particular ignores
 *   `download` on `data:` URLs and just navigates to/displays the image
 *   instead of saving it.
 * - **Desktop browser:** falls back to the classic `<a download>` click,
 *   which works fine there and needs no extra permissions or plugins.
 *
 * Returns whether the save/share flow completed (or was cancelled by the
 * person, which we don't treat as a failure) — false only on genuine error,
 * so the caller can show a "couldn't save" state.
 */
export async function saveImageToDevice(dataUrl: string, filename: string): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    return saveViaCapacitor(dataUrl, filename);
  }
  if (await saveViaWebShare(dataUrl, filename)) return true;
  return saveViaAnchorDownload(dataUrl, filename);
}

async function saveViaCapacitor(dataUrl: string, filename: string): Promise<boolean> {
  try {
    // Dynamically imported so web builds that never run inside Capacitor
    // don't need these packages resolvable at import time.
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    const base64Data = dataUrl.slice(dataUrl.indexOf(",") + 1);
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    });
    await Share.share({ url: uri, dialogTitle: "Save picture" });
    return true;
  } catch {
    return false;
  }
}

async function saveViaWebShare(dataUrl: string, filename: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) return false;
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type || "image/png" });
    if (!navigator.canShare({ files: [file] })) return false;
    await navigator.share({ files: [file] });
    return true;
  } catch (error) {
    // The person backing out of the share sheet isn't a save failure.
    if (error instanceof DOMException && error.name === "AbortError") return true;
    return false;
  }
}

function saveViaAnchorDownload(dataUrl: string, filename: string): boolean {
  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch {
    return false;
  }
}
