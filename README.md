# Happy Kids Academy

A modern, accessible, offline-capable web rebuild of the "Happy Kids Academy" Android app, built with Next.js (App Router), TypeScript (strict), Tailwind CSS v4, Zustand, Framer Motion, and Recharts.

See [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) for the full architecture, content inventory, and design decisions behind this rebuild.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the local dev server |
| `pnpm build` | Production build (static export of every route) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (flat config, `eslint-config-next`) |
| `pnpm typecheck` | `tsc --noEmit` in strict mode |

Run `pnpm lint` and `pnpm typecheck` before committing — both must be clean.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript, `strict: true`, `noUncheckedIndexedAccess: true`
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config in `src/app/globals.css`), OKLCH color tokens, light/dark themes via `next-themes`
- **UI primitives:** Hand-built, shadcn/ui-style components on Radix UI primitives (`src/components/ui`)
- **State:** Zustand, persisted to `localStorage` (`src/store`)
- **Animation:** Framer Motion (confetti, feedback toasts)
- **Charts:** Recharts (parent dashboard)
- **Icons:** lucide-react
- **Package manager:** pnpm

## Project structure

```
src/
├─ app/            # Routes (App Router), metadata, sitemap, robots, manifest
├─ components/
│  ├─ ui/          # Reusable primitives: Button, Card, Dialog, Switch, Tabs, Tooltip…
│  └─ shared/      # App chrome: header, nav, breadcrumbs, feedback toast, confetti…
├─ features/       # Feature-based modules: home, learn, quiz, games/*, rewards,
│                    parent-dashboard, study-coach, settings, writing-practice
├─ data/categories/  # The 13 learning categories, ported from the Android source
├─ store/          # Zustand stores (progress, settings, study coach)
├─ lib/            # speech (Web Speech API), audio (Web Audio chime), haptics,
│                    quiz generators, SEO helpers
├─ types/          # Shared TypeScript types
└─ hooks/          # Cross-feature React hooks
```

## Content fidelity

All learning content (26 letters, 100 numbers, 43 math facts, 10 shapes, 10 colors, 50 animals,
30 birds, 30 fruits, 30 vegetables, 20 vehicles, 20 body parts, 49 Gujarati letters, 49 Hindi
letters) is ported 1:1 from the original Android `EnhancedLearningView.java`. See §1.3 of the
migration plan for the full inventory and any intentional improvements over the original.

## Deployment

This project has no server-side data dependencies (all content is static, all progress is
client-local), so it deploys to Vercel with zero configuration:

```bash
vercel deploy
```

Set `NEXT_PUBLIC_SITE_URL` in your environment to your production domain so metadata,
`sitemap.xml`, and `robots.txt` emit the correct absolute URLs.

## Android app (Capacitor)

The same static export is wrapped as a native Android app via [Capacitor](https://capacitorjs.com),
configured in [`capacitor.config.ts`](./capacitor.config.ts) with `appId: "com.happykids.academy"` —
matching the original Android app's package name.

**Requirements (local machine, not needed for the web app itself):**
- [Android Studio](https://developer.android.com/studio) (includes the Android SDK)
- A JDK compatible with the bundled Android Gradle Plugin (Android Studio manages this for you)

**Build & run:**

```bash
pnpm install
pnpm run cap:sync        # next build (static export) + copies it into android/app/src/main/assets
pnpm run cap:open:android  # opens the android/ project in Android Studio
```

From Android Studio, click **Run** to install on a connected device/emulator, or
**Build → Generate Signed Bundle / APK** to produce a release build for the Play Store.

Whenever web code changes, re-run `pnpm run cap:sync` before rebuilding in Android Studio — the
`android/app/src/main/assets/public` folder is generated output and shouldn't be edited directly.

**App icon & splash screen:** the browser favicon, PWA/manifest icons, apple-touch-icon, Android
launcher icons, and the native splash screen are all generated from
[`public/logo.png`](./public/logo.png). If that logo changes, regenerate everything with:

```bash
npx capacitor-assets generate --android
```

This reads `assets/icon.png` and `assets/splash.png` (pre-composed, padded versions of the logo —
regenerate those too if you want to change the padding/background) and writes every Android
density automatically. The web icons (`public/favicon.ico`, `public/icons/*.png`) are a manual step —
resize `assets/icon.png` to 192/512/180px and re-run `PIL`'s `.ico` export, or swap in your own.

Notes:
- The app has no server/API routes, so `output: "export"` in `next.config.ts` is safe — everything
  Capacitor needs is static HTML/JS/CSS.
- `navigator.vibrate` and the Web Speech API (used for pronunciation) already work inside Android's
  WebView; no native Capacitor plugins were needed for these.
- Google Analytics (`src/components/shared/google-analytics.tsx`) still loads from
  `googletagmanager.com`, so the packaged app needs network access for analytics to report (it
  degrades gracefully offline — the rest of the app works fully without a connection).
