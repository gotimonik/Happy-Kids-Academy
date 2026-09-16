"use client";

import { Capacitor } from "@capacitor/core";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StaticLink } from "@/components/shared/static-link";
import { useTranslation } from "@/lib/i18n/use-translation";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.happykids.academy";

/** `localStorage` key remembering a dismissal — a one-off cosmetic flag with
 * nothing else in the app that needs to read or react to it, so a plain
 * direct key is used here rather than adding a whole new Zustand `persist`
 * store just for this. */
const DISMISSED_KEY = "hka:installBannerDismissed";

/** Android's own brand green, used only here — no category or theme token
 * already means "get this from Google Play". */
const ANDROID_GREEN = "#3DDC84";

/**
 * A big "get the app" banner on the Home page — shown only to visitors on
 * the web build. Someone already inside the packaged Android app has
 * nothing to install, so `Capacitor.isNativePlatform()` hides this there
 * entirely. Dismissing it is remembered in `localStorage` so a visitor who's
 * already seen it (or already has the app) isn't asked again on every visit.
 *
 * Renders `null` until mounted — the static export serves the *exact same*
 * HTML/JS to both the web site and the native WebView, so whether this
 * should show at all is a client-only decision that can't be known from the
 * server-rendered markup itself. Same pattern `ThemeToggle`/`HomeHero`
 * already use to avoid a hydration mismatch.
 */
export function InstallAppBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;
    const dismissed = window.localStorage.getItem(DISMISSED_KEY) === "1";
    if (!dismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only visibility check, see comment above
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible) return null;

  return (
    <section
      className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl p-5 pt-8 text-center text-white shadow-lg sm:flex-row sm:gap-5 sm:p-6 sm:pr-14 sm:text-left"
      style={{
        backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${ANDROID_GREEN} 85%, white), ${ANDROID_GREEN})`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
      />
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("home.installBanner.dismiss")}
        className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-white/80 transition-colors hover:bg-black/10 hover:text-white"
      >
        <X className="size-4" aria-hidden="true" />
      </button>

      <span
        aria-hidden="true"
        className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl"
      >
        📲
      </span>

      <div className="relative min-w-0 flex-1">
        <h2 className="font-display text-lg font-bold sm:text-xl">{t("home.installBanner.title")}</h2>
        <p className="mt-0.5 text-sm text-white/90">{t("home.installBanner.description")}</p>
      </div>

      <Button
        asChild
        size="md"
        accentColor="#FFFFFF"
        className="relative w-full shrink-0 text-[#1B7A43] hover:brightness-105 sm:w-auto"
      >
        <StaticLink href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
          <Download className="size-4" aria-hidden="true" />
          {t("home.installBanner.cta")}
        </StaticLink>
      </Button>
    </section>
  );
}
