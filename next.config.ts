import type { NextConfig } from "next";

// `output: "export"` produces a fully static `out/` build (no Node server),
// which is what Capacitor packages into the Android WebView shell. This app
// has no route handlers, middleware, or server actions, so the switch is
// safe — everything already renders as static/SSG pages.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
