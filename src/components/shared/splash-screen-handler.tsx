"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

export function SplashScreenHandler() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const hide = async () => {
      // Wait until everything has been painted
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Small extra delay helps slower devices
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 100);
    };

    hide();
  }, []);

  return null;
}