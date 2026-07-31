import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Matches the original Android app's package name so this can be treated
  // as a continuation/replacement of that app on the Play Store.
  appId: "com.happykids.academy",
  appName: "Happy Kids Academy",
  // Next's static export output — see next.config.ts (`output: "export"`).
  webDir: "out",
  server: {
    // Bundled assets are served from a local origin inside the WebView;
    // androidScheme "https" avoids mixed-content issues with any future
    // https:// requests (e.g. Google Analytics) made from the app.
    androidScheme: "https",
  },
  plugins: {
    // Launch screen shown while the native shell starts up, generated from
    // logo.png (see `assets/splash.png`, `npx capacitor-assets generate`).
    // The whole app is a static export with no network calls to wait on, so
    // a fixed short duration (rather than manual JS-driven hide()) is all
    // that's needed — it just gives the brand a beat to register.
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#FFF8EEFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
