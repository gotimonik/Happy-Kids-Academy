import type { Metadata, Viewport } from "next";
import { Baloo_2, Baloo_Bhai_2, Nunito } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { AppShell } from "@/components/shared/app-shell";
import { AppUpdateHandler } from "@/components/shared/app-update-handler";
import { BackButtonHandler } from "@/components/shared/back-button-handler";
import { DeepLinkHandler } from "@/components/shared/deep-link-handler";
import { SplashScreenHandler } from "@/components/shared/splash-screen-handler";
import { GoogleAnalytics } from "@/components/shared/google-analytics";
import { ParentalGateHost } from "@/components/shared/parental-gate-host";
import { PwaRegister } from "@/components/shared/pwa-register";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { SessionTimeTracker } from "@/components/shared/session-time-tracker";
import { StreakMilestoneCelebration } from "@/components/shared/streak-milestone-celebration";
import { StreakTracker } from "@/components/shared/streak-tracker";
import "./globals.css";

const baloo = Baloo_2({
  // "latin" alone left this font with zero Devanagari glyphs, so any Hindi
  // guide letter drawn with it (the Writing Practice trace pad, which reads
  // this font straight off the DOM via getComputedStyle — see
  // use-trace-pad.ts) had no real glyph to render at all. Browsers differ
  // wildly in what they substitute for a missing glyph on <canvas>
  // (unlike normal DOM text, canvas fillText doesn't reliably do
  // per-character fallback+shaping), which is why the guide letter came out
  // as visibly wrong/garbled glyphs on some real devices (seen especially on
  // Realme/Xiaomi Android and iPad) instead of a consistent "just a bit off"
  // look everywhere. Baloo 2 actually ships Devanagari glyphs upstream —
  // this was only ever a missing subset, not a missing font.
  subsets: ["latin", "devanagari"],
  variable: "--font-baloo",
  display: "swap",
});

// Gujarati guide letters have the same problem, but Baloo 2 itself has no
// Gujarati glyphs at all (Google Fonts ships that as the sibling family
// "Baloo Bhai 2") — so Hindi and Gujarati each need their own loaded font
// here, and the trace pad picks between them by the guide text's script
// (see `guideFontVariable` in use-trace-pad.ts).
const balooGujarati = Baloo_Bhai_2({
  subsets: ["latin", "gujarati"],
  variable: "--font-baloo-gujarati",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.playfantacy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Happy Kids Academy — Learn, Play, Grow",
    template: "%s | Happy Kids Academy",
  },
  description:
    "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games — all in one playful web app.",
  keywords: [
    "kids learning app",
    "preschool learning games",
    "alphabet games for kids",
    "learn numbers for kids",
    "math games for kids",
    "Gujarati alphabet for kids",
    "Hindi alphabet for kids",
    "educational games for children",
  ],
  applicationName: "Happy Kids Academy",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Happy Kids Academy",
    title: "Happy Kids Academy — Learn, Play, Grow",
    description:
      "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games.",
    url: siteUrl,
    // Without this, links shared to chat/social apps (e.g. the Rewards page's
    // "Share my progress" button, which can only send a plain URL/text on
    // platforms without file-sharing support) unfurl with no picture at all —
    // a static export can't generate a per-share image on demand, so this is
    // the app's one general-purpose "come play" preview card.
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Happy Kids Academy — Learn, Play & Grow Every Day! Fun & interactive learning for kids.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Kids Academy — Learn, Play, Grow",
    description:
      "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    // One color regardless of the device's light/dark setting, since the
    // app no longer follows it (see ThemeProvider below) — the brand purple
    // matches the header in both of the app's own themes.
    { color: "#6C5CE7" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // No pinch/double-tap zoom: the app's layout is already sized for small
  // screens, and accidental zooms are common with young children.
  userScalable: false,
  // Lets the page draw under the iPhone notch/Dynamic Island and home
  // indicator (iOS app + Safari) so `env(safe-area-inset-*)` reports real
  // values; AppHeader/SiteFooter pad themselves with those insets. Has no
  // effect on devices without a cutout, where the insets are 0.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning here too: some browser extensions (Grammarly,
        password managers, etc.) inject attributes like `data-gr-ext-installed`
        onto <body> before React hydrates. That's a harmless client-only
        difference, not an app bug — see https://react.dev/link/hydration-mismatch.
      */}
      <body
        className={`${baloo.variable} ${balooGujarati.variable} ${nunito.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          // Light by default for everyone, whatever the device's own
          // light/dark setting — the dark theme is only used when it's
          // picked with the header's sun/moon toggle (remembered per device).
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AnimatedBackground />
          <SplashScreenHandler />
          <BackButtonHandler />
          <DeepLinkHandler />
          <AppUpdateHandler />
          <ScrollToTop />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SessionTimeTracker />
          <StreakTracker />
          <StreakMilestoneCelebration />
          <PwaRegister />
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          {/* iOS-only "ask a grown-up" check before anything leaves the app. */}
          <ParentalGateHost />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
