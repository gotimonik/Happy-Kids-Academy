"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

export function SplashScreenHandler() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const hide = async () => {
      // Wait for the Baloo_2/Nunito web fonts to finish loading — hiding the
      // splash before they're in would swap them for fallback fonts right as
      // the first screen appears, which reads the same as a blank flash.
      if ("fonts" in document) {
        await document.fonts.ready.catch(() => {});
      }

      // Wait until everything has been painted
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Small extra delay helps slower devices actually finish hydrating
      // (e.g. the home page's SideNav/HomeHero skeleton-to-real swap, which
      // needs one more render pass after mount) before the splash lifts.
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 200);
    };

    hide();
  }, []);

  return null;
}