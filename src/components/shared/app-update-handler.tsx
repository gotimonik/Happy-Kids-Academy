"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import {
  AppUpdate,
  AppUpdateAvailability,
  FlexibleUpdateInstallStatus,
} from "@capawesome/capacitor-app-update";

/**
 * Checks the Play Store for a newer build of the app and, if one exists,
 * applies it through Google Play's in-app update flow — no manual "go to
 * the Play Store" step for the user.
 *
 * Two flows, chosen by the release's in-app update priority (set 0–5 when
 * publishing a release on the Play Console; defaults to 0):
 *
 *  - Priority >= IMMEDIATE_UPDATE_PRIORITY_THRESHOLD uses Play's own
 *    full-screen IMMEDIATE flow, which blocks the app until the update
 *    installs. Reserve high priorities for releases that actually need to
 *    interrupt a session (a broken build, a required content fix) — a kids'
 *    app shouldn't force this on routine releases.
 *  - Everything else uses a FLEXIBLE update: Play downloads it silently in
 *    the background while the child keeps playing, and this component
 *    shows a small "ready to update" bar only once the download has
 *    actually finished, letting them restart on their own terms.
 *
 * Renders nothing on web/PWA. On native, any failure (no Play Store on the
 * device, an emulator/sideloaded build without Play Services, a throttled
 * check, etc.) is swallowed silently — a missed update check should never
 * interrupt or error out a session.
 */

const IMMEDIATE_UPDATE_PRIORITY_THRESHOLD = 4;

// Persisted in sessionStorage rather than a `useRef`: every in-app
// navigation in this static-export app is a hard `window.location` reload
// (see StaticLink/DeepLinkHandler), which remounts this component and would
// reset a ref to `false` on every single page. Without this, once Play
// makes a flexible update available, tapping between pages re-triggers
// `startFlexibleUpdate()` on every navigation — re-showing Play's update
// consent sheet to a kid mid-session. sessionStorage survives the reload
// but clears when the app is actually closed, matching "try once per app
// open" rather than "try once per JS runtime instance".
const FLEXIBLE_UPDATE_STARTED_KEY = "hka:flexibleUpdateStarted";

function hasStartedFlexibleUpdate(): boolean {
  try {
    return sessionStorage.getItem(FLEXIBLE_UPDATE_STARTED_KEY) === "1";
  } catch {
    return false;
  }
}

function markFlexibleUpdateStarted() {
  try {
    sessionStorage.setItem(FLEXIBLE_UPDATE_STARTED_KEY, "1");
  } catch {
    // Storage unavailable (private mode, quota, etc.) — worst case we ask
    // Play to start the flow again next check, which is harmless.
  }
}

export function AppUpdateHandler() {
  const [readyToInstall, setReadyToInstall] = useState(false);

  const checkForUpdate = useCallback(async () => {
    try {
      const info = await AppUpdate.getAppUpdateInfo();

      // A flexible update can finish downloading while the app is closed or
      // backgrounded. The live `onFlexibleUpdateStateChange` listener below
      // only fires for a transition it's actually around to see, so a
      // reopen after that point needs this snapshot check instead — without
      // it, a download that completed last session would never surface the
      // "ready to install" bar again.
      if (info.installStatus === FlexibleUpdateInstallStatus.DOWNLOADED) {
        setReadyToInstall(true);
        return;
      }

      // An immediate update that got interrupted (e.g. the app was killed
      // mid-flow) needs to be resumed explicitly — Play doesn't retry it on
      // its own.
      if (info.updateAvailability === AppUpdateAvailability.UPDATE_IN_PROGRESS) {
        if (info.immediateUpdateAllowed) {
          await AppUpdate.performImmediateUpdate();
        }
        return;
      }

      if (info.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
        return;
      }

      const isHighPriority = (info.updatePriority ?? 0) >= IMMEDIATE_UPDATE_PRIORITY_THRESHOLD;

      if (isHighPriority && info.immediateUpdateAllowed) {
        await AppUpdate.performImmediateUpdate();
        return;
      }

      if (!hasStartedFlexibleUpdate() && info.flexibleUpdateAllowed) {
        markFlexibleUpdateStarted();
        await AppUpdate.startFlexibleUpdate();
      }
    } catch {
      // No Play Store / Play Services available, or the check was
      // throttled — nothing to do.
    }
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // checkForUpdate() can call setReadyToInstall once it learns a flexible
    // download already finished (e.g. in a previous app session) — a
    // one-time "report already-settled external state" call, not a
    // fetch-effect loop, so this is the same intentional case as the
    // hydration guards in use-store-hydrated.ts / theme-toggle.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkForUpdate();

    const flexibleListenerPromise = AppUpdate.addListener(
      "onFlexibleUpdateStateChange",
      (state) => {
        if (state.installStatus === FlexibleUpdateInstallStatus.DOWNLOADED) {
          setReadyToInstall(true);
        }
      },
    );

    // Re-check whenever the app comes back to the foreground: catches an
    // immediate update Play needs resumed, and covers the ordinary case
    // where a flexible download finished while the app was backgrounded.
    const resumeListenerPromise = CapacitorApp.addListener("resume", () => {
      void checkForUpdate();
    });

    return () => {
      flexibleListenerPromise.then((listener) => listener.remove());
      resumeListenerPromise.then((listener) => listener.remove());
    };
  }, [checkForUpdate]);

  const install = useCallback(() => {
    // completeFlexibleUpdate() restarts the app to apply the update that's
    // already on disk. If it fails for some reason, Play just installs it
    // next time the app is naturally closed and reopened.
    void AppUpdate.completeFlexibleUpdate().catch(() => {});
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-4 top-[calc(env(safe-area-inset-top)+0.75rem)] z-40 flex justify-center">
      <AnimatePresence>
        {readyToInstall && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-xl"
          >
            <Download className="size-5 shrink-0" aria-hidden="true" />
            <span>A new update is ready!</span>
            <button
              type="button"
              onClick={install}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-white/30"
            >
              Restart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
