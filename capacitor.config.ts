import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Matches the original Android app's package name so this can be treated
  // as a continuation/replacement of that app on the Play Store.
  appId: "com.happykids.academy",
  appName: "Happy Kids Academy",
  // Next's static export output — see next.config.ts (`output: "export"`).
  webDir: "out",
  server: {
    // Bundled assets are served from a local origin inside the WebView
    // (https://localhost on Android, capacitor://localhost on iOS);
    // androidScheme "https" avoids mixed-content issues with any future
    // https:// requests (e.g. Google Analytics) made from the app.
    androidScheme: "https",
  },
  ios: {
    // Full-screen WebView (edge to edge, under the status bar / notch /
    // home indicator). The page opts into `viewport-fit=cover` (see
    // `viewport` in src/app/layout.tsx), so `env(safe-area-inset-*)` reports
    // the real insets and the header/footer pad themselves with it — the
    // header's gradient fills the status bar area and the footer runs to the
    // bottom edge. (`"always"` instead lets scrolled content show through
    // above the sticky header and leaves a native-colored strip under the
    // footer.)
    contentInset: "never",
  },
  plugins: {
    // Launch screen: the app logo (`public/logo.png`) centered on white, from
    // `assets/splash.png` (`npx capacitor-assets generate`). The logo is kept
    // to ~38% of the square image so it isn't cropped when iOS aspect-fills
    // it onto a tall phone screen.
    //
    // It stays up until the first screen is actually painted:
    // `SplashScreenHandler` calls `SplashScreen.hide()` once fonts have
    // loaded and the page has rendered, then it fades out. A non-zero
    // `launchShowDuration` is required for that — with 0 the plugin never
    // shows its launch overlay at all, so iOS flashed the logo for a split
    // second and then showed a blank WebView while the page loaded.
    // `launchAutoHide` + the duration act only as a safety net in case the
    // web app never calls hide().
    SplashScreen: {
      launchShowDuration: 4000,
      launchAutoHide: true,
      launchFadeOutDuration: 250,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "FIT_CENTER",
      showSpinner: false,
    },
  },
};

export default config;
