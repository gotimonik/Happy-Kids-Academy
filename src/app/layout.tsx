import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppShell } from "@/components/shared/app-shell";
import { GoogleAnalytics } from "@/components/shared/google-analytics";
import { PwaRegister } from "@/components/shared/pwa-register";
import { SessionTimeTracker } from "@/components/shared/session-time-tracker";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.example.com";

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
    icon: "/icons/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Happy Kids Academy",
    title: "Happy Kids Academy — Learn, Play, Grow",
    description:
      "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Kids Academy — Learn, Play, Grow",
    description:
      "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6C5CE7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1830" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${baloo.variable} ${nunito.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SessionTimeTracker />
          <PwaRegister />
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
