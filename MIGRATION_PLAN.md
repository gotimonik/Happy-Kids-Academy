# Happy Kids Academy — Android → Next.js Migration Plan

**Source app:** `com.happykids.academy` ("Happy Kids Academy", v5.0, min SDK 23 / target SDK 35)
**Destination:** New Next.js (App Router) web app, project folder `Kids Learning Web`
**Status:** Analysis phase complete. No application code has been generated yet, per the requested workflow. This document is the single source of truth for the rebuild and should be updated as modules ship.

---

## 1. Project Overview

### 1.1 What the Android app actually is

This is important because it changes the migration strategy: **the Android app is not a multi-screen app with Activities/Fragments/layouts/assets.** It is a single `Activity` (`MainActivity`) that hosts one custom `View` (`EnhancedLearningView`, 673 lines) which does everything itself:

- Renders every screen by hand with `Canvas` drawing primitives (rounded rects, circles, text, paths). There are **no XML layouts, no Fragments, no RecyclerView/Adapters, no drawable images, no audio files, no JSON files, no bitmap assets.**
- All icons are Unicode emoji drawn as text glyphs (🦁, 🍎, ☂, etc.). The only real graphic asset is the launcher icon (`app_icon.xml`, a vector drawable) and a single `styles.xml` theme.
- "Screens" are an `int` state machine (`HOME`, `CATEGORY`, `LEARN`, `QUIZ`, `CELEBRATE`, `GAMES`, `REWARDS`, `PARENT`, `SETTINGS`, `TRACE`, `BALLOON`, `MATCH`, `MATH_LAB`, `COACH`, `GUIDE` — 15 total) switched on inside `onDraw`/`handle(int action)`.
- "Buttons" are invisible hit-test rectangles (`hit()` / `hits` list) checked manually in `onTouchEvent` — there is no real button, focus, or accessibility tree. **This means the current app has zero screen-reader/keyboard accessibility**, which the web version must fix, not preserve.
- All learning content (letters, numbers, math facts, animals, birds, fruits, vegetables, vehicles, body parts, Gujarati and Hindi alphabets) is hard-coded as Java string arrays inside the same file.
- Voice is Android `TextToSpeech`; the win chime is synthesized at runtime with `ToneGenerator` (no audio files); feedback also uses `Vibrator`. Progress is persisted via `SharedPreferences` ("progress" file).

Net effect: there is no legacy UI to "port pixel-for-pixel." The real migration task is porting **content + business logic + interaction model**, and building an entirely new, real component-based UI on top of it — which aligns exactly with the "don't look like a converted Android app" requirement.

### 1.2 Full feature inventory (Analysis Phase deliverable)

| Category | Finding |
|---|---|
| Activities | 1 — `MainActivity` (fullscreen, no title bar, portrait-locked, custom back-stack via `goBack()`) |
| Fragments | 0 |
| Custom Views | 1 — `EnhancedLearningView` (673 lines, implements `TextToSpeech.OnInitListener`) |
| Adapters / RecyclerViews | 0 (all lists are hand-drawn grids inside `onDraw`) |
| XML Layouts | 0 |
| Drawables | 1 — `app_icon.xml` (vector, launcher icon only) |
| Styles/Themes | 1 — `AppTheme` (purple accent `#6C5CE7`, cream nav bar `#FFF8EE`, purple status bar) |
| Raster images / bitmaps | 0 |
| Audio files | 0 (chime synthesized via `ToneGenerator`; speech via TTS) |
| JSON / external data files | 0 (all content is inline Java arrays) |
| Animations | Manual, per-frame, via `invalidate()`/`postInvalidateOnAnimation()` — balloon fall physics, confetti dots, feedback toast timers, animated math-story "ball" sequencing via `Handler.postDelayed` |
| Navigation model | Single-activity, manual integer screen state + manual back stack logic in `goBack()` |
| Storage | `SharedPreferences` file `"progress"` — keys: `volume`, `music`, `language`, `stars_{i}`, `best_{i}`, `coins`, `lessons`, `time_seconds` |
| Settings | Language (English/Gujarati/Hindi cycle), Voice on/off, Music on/off, Reset Progress |
| Progress tracking | Per-category best quiz score & stars, total coins, lessons completed, cumulative time spent |
| Achievements/Badges | Derived, not stored: `badges = totalStars / 3`, `level = 1 + totalStars / 8`, certificate unlocked at 15 stars |
| Voice features | Android TTS, per-item pronunciation, per-tap UI label speech, praise phrases in 3 languages, automatic locale switch by Unicode range detection (Gujarati `઀–૿`, Hindi `ऀ–ॿ`) |
| Quiz engine | Generic: shuffles 2 wrong labels from the same category + 1 correct, 10 rounds, scores, stars/coins on completion; plus 5 "grade games" with bespoke question generators |
| Games | 16 tiles listed in the Games hub; **only 8 are actually wired to unique logic** (see §1.4) — the rest fall back to the generic mixed quiz |
| Learning modules (13 categories) | Alphabet (26), Numbers (100), Math (43 facts), Shapes (10), Colors (10), Animals (50), Birds (30), Fruits (30), Vegetables (30), Vehicles (20), Body Parts (20), Gujarati (49 letters), Hindi (49 letters) |
| Data models | `Item` (symbol/icon/label/detail/speech/sound/visualColor), `Category` (icon/title/subtitle/color/items/trace flag), `Balloon` (ephemeral game object) |
| Special modules | Visual Math Lab (animated add/sub/mult/div stories), Study Coach (grade-adjusted game variations, offline treasure hunt, 30-minute daily routine), Writing/Trace practice (freehand path drawing over a guide glyph) |

### 1.3 The 13 learning categories (exact content to port)

| # | Category | Items | Trace practice? | Notes |
|---|---|---|---|---|
| 1 | Alphabet | 26 (A–Z) | Yes | Letter + example word + emoji + pronunciation |
| 2 | Numbers | 100 (1–100) | Yes | Word names for 1–20, "Number N" after; odd/even + dot count detail |
| 3 | Math | 43 facts | No | 10 addition, 10 subtraction, 10 multiplication (×2), 10 division (÷2), 3 comparison |
| 4 | Shapes | 10 | No | Circle, Square, Triangle, Rectangle, Star, Oval, Diamond, Heart, Pentagon, Hexagon |
| 5 | Colors | 10 | No | Rendered as filled circle swatches, not emoji |
| 6 | Animals | 50 | No | Name + emoji + sound word (e.g., "Roar", "Moo") where available |
| 7 | Birds | 30 | No | Name + emoji |
| 8 | Fruits | 30 | No | Name + emoji |
| 9 | Vegetables | 30 | No | Name + emoji |
| 10 | Vehicles | 20 | No | Name + emoji |
| 11 | Body Parts | 20 | No | Name + emoji |
| 12 | Gujarati | 49 (13 સ્વર + 36 વ્યંજન) | Yes | Letter + example word + emoji |
| 13 | Hindi | 49 (13 स्वर + 36 व्यंजन) | Yes | Letter + example word + emoji |

### 1.4 Games hub — what's real vs. what's a stub today

This is a deliberate improvement opportunity, not a bug to hide:

| Tile | Wired logic today | Web plan |
|---|---|---|
| Balloon Pop | ✅ real (falling-balloon tap game) | Rebuild with Canvas/Framer Motion |
| Matching Game | ✅ real (4 modes: letter→picture, number→word, shape→name, fruit→name) | Rebuild as drag/tap board |
| Tracing Letters / Numbers | ✅ real (routes into Trace screen) | Rebuild as pointer-events canvas |
| Missing Number, Odd or Even, Times Tables | ✅ real (bespoke question generators, routed through quiz UI) | Keep generators, reuse new Quiz Engine |
| Math Stories | ✅ real (routes into Visual Math Lab) | Rebuild as Math Lab feature |
| Memory Game, Drag and Drop, Puzzle, Find Correct Answer, Coloring, Drawing, Word Builder\*, Patterns\* | ⚠️ stub — falls back to generic mixed quiz (`else { mixedQuiz = true; startQuiz(); }`) | **Recommended improvement:** build these out as real, distinct mini-games in the web app using the shared Game Engine (see §9), rather than reproducing the stub behavior |

\* Word Builder and Patterns *do* have real bespoke generators (`gradeGame` 14 and 13/else-branch), but Memory Game, Drag and Drop, Puzzle, Find Correct Answer, Coloring, and Drawing are pure stubs today.

---

## 2. Architecture

- **Framework:** Next.js (latest, App Router), TypeScript strict mode.
- **Rendering model:** Server Components by default for all static/marketing/informational shells (home hero, category landing content, SEO copy, breadcrumbs). Client Components only where interaction, canvas, audio, speech, or local storage is required (quiz engine, games, trace pad, settings toggles).
- **Architecture style:** Feature-based ("package by feature," not "package by type"). Each learning/game feature owns its components, hooks, and data under `src/features/*`; cross-cutting UI lives in `src/components/*`.
- **Interaction model replacement:** the Android app's manual `hits` array (invisible tap rectangles) is replaced everywhere by real semantic elements — `<button>`, `<a>`, `role="radiogroup"`, etc. — giving native focus, keyboard, and screen-reader support for free.
- **Content as data:** all 13 category datasets are ported 1:1 into typed TypeScript modules (`src/data/categories/*.ts`), validated with Zod so a malformed entry fails the build, not runtime.
- **State:** Zustand for persisted cross-page state (progress, settings); local component/hook state for ephemeral game/quiz state — mirroring the original's own separation of `SharedPreferences` (persisted) vs. in-memory fields (session).
- **Engines, not one-offs:** a reusable Quiz Engine (`useQuizEngine`) and a reusable Game Engine contract power every quiz/game screen instead of copy-pasting logic per category, which is what the Android file did (each screen is a bespoke `draw*` method).

---

## 3. Folder Structure

```
kids-learning-web/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                     # root layout: fonts, ThemeProvider, PWA head tags
│  │  ├─ page.tsx                       # Home
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  ├─ manifest.ts                    # PWA manifest
│  │  ├─ opengraph-image.tsx
│  │  ├─ learn/
│  │  │  └─ [category]/
│  │  │     ├─ page.tsx                 # category hub (Learn / Quiz / Trace-or-MathLab)
│  │  │     ├─ lesson/page.tsx          # flashcard carousel
│  │  │     ├─ quiz/page.tsx            # quiz session + celebrate
│  │  │     └─ practice/page.tsx        # writing/trace practice (categories with trace=true)
│  │  ├─ quiz/page.tsx                  # Mixed Quiz
│  │  ├─ games/
│  │  │  ├─ page.tsx                    # Games hub grid
│  │  │  ├─ balloon-pop/page.tsx
│  │  │  ├─ matching/page.tsx
│  │  │  ├─ math-lab/page.tsx
│  │  │  ├─ missing-number/page.tsx
│  │  │  ├─ odd-or-even/page.tsx
│  │  │  ├─ times-tables/page.tsx
│  │  │  ├─ word-builder/page.tsx
│  │  │  ├─ patterns/page.tsx
│  │  │  ├─ memory/page.tsx             # new, real implementation (was a stub)
│  │  │  ├─ puzzle/page.tsx             # new, real implementation (was a stub)
│  │  │  └─ coloring/page.tsx           # new, real implementation (was a stub)
│  │  ├─ rewards/page.tsx
│  │  ├─ parents/page.tsx               # "Parent Progress"
│  │  ├─ study-coach/
│  │  │  ├─ page.tsx
│  │  │  ├─ game-variations/page.tsx
│  │  │  ├─ treasure-hunt/page.tsx
│  │  │  └─ daily-routine/page.tsx
│  │  └─ settings/page.tsx
│  ├─ components/
│  │  ├─ ui/                            # shadcn/ui primitives (button, card, dialog, sheet, tabs, progress, badge…)
│  │  └─ shared/                        # AppHeader, BottomNav, PageContainer, EmptyState, ErrorState,
│  │                                     # SkeletonCard, ConfettiOverlay, FeedbackToast, StatPill,
│  │                                     # LevelBadge, ThemeToggle, LanguageSwitcher, Breadcrumbs
│  ├─ features/
│  │  ├─ home/
│  │  ├─ categories/                    # CategoryGrid, CategoryTile, CategoryHero
│  │  ├─ learn/                         # FlashCard, LearnCarousel, PronounceButton, SoundButton
│  │  ├─ quiz/                          # useQuizEngine, QuestionCard, OptionButton, ScoreBar, CelebrateScreen
│  │  ├─ games/
│  │  │  ├─ engine/                     # shared Game Engine contract + GameShell component
│  │  │  ├─ balloon-pop/
│  │  │  ├─ matching/
│  │  │  ├─ math-lab/
│  │  │  ├─ memory/
│  │  │  ├─ puzzle/
│  │  │  └─ coloring/
│  │  ├─ writing-practice/              # TraceCanvas, useTracePad
│  │  ├─ rewards/                       # StatCard, BadgeGrid, CertificateBanner
│  │  ├─ parent-dashboard/              # ProgressRow, SummaryCard, TimeChart (Recharts)
│  │  ├─ study-coach/                   # GradeSelector, GameVariationList, TreasureHunt, DailyRoutine
│  │  └─ settings/                      # LanguageSetting, VoiceToggle, MusicToggle, ResetProgressDialog
│  ├─ data/
│  │  └─ categories/                    # alphabet.ts, numbers.ts, math.ts, shapes.ts, colors.ts,
│  │                                     # animals.ts, birds.ts, fruits.ts, vegetables.ts, vehicles.ts,
│  │                                     # body-parts.ts, gujarati.ts, hindi.ts, index.ts
│  ├─ store/                            # progressStore.ts, settingsStore.ts (Zustand + persist)
│  ├─ lib/
│  │  ├─ speech/                        # useSpeechSynthesis, localeForText()
│  │  ├─ audio/                         # useChime (Web Audio synthesized tones)
│  │  ├─ haptics/                       # vibrate() wrapper with feature detection
│  │  ├─ quiz/                          # pickDistractors(), shuffle()
│  │  └─ seo/                           # metadata builders, JSON-LD builders
│  ├─ hooks/                            # useProgress, useSettings, useReducedMotion, usePwaInstallPrompt
│  ├─ types/                            # category.ts, item.ts, progress.ts, game.ts
│  └─ styles/                           # globals.css, tailwind.config
├─ public/
│  ├─ icons/ (PWA icons), fonts/ (if self-hosting beyond next/font), sw.js
├─ tests/
│  ├─ unit/, component/, e2e/
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json (strict: true)
└─ package.json (pnpm)
```

---

## 4. Component Tree (high level)

```
RootLayout
├─ ThemeProvider (next-themes)
├─ AppHeader (logo, streak/coins pill, theme toggle, language switcher)
├─ <page content>
├─ BottomNav (mobile) / SideNav (desktop/tablet) — Home · Learn · Games · Rewards · Parents · Settings
└─ ConfettiOverlay / FeedbackToast (portal, replaces the Android bottom feedback bar)

HomePage
├─ HomeHero (title, tagline, total-stars pill)
└─ CategoryGrid
   ├─ CategoryTile × 13
   └─ SpecialTile × 6 (Quiz, Games, Rewards, Parent Progress, Study Coach, Settings)

CategoryHubPage
├─ CategoryHero (icon, title, subtitle, item count)
├─ ActionCard "Learn" → /learn/[category]/lesson
├─ ActionCard "Play Quiz" → /learn/[category]/quiz
├─ ActionCard "Writing Practice" (if trace) → /learn/[category]/practice
│  or ActionCard "Visual Math Lab" (math only) → /games/math-lab
└─ BestScoreCard

LearnCarouselPage
├─ FlashCard (symbol/swatch, icon, label, detail)
├─ PronounceButton (speech)
├─ SoundButton (animal/bird sound word, when present)
└─ CarouselControls (Back / Next / Finish)

QuizSessionPage (shared by per-category quiz, Mixed Quiz, and grade games)
├─ QuizProgressHeader (Question x/10, Score)
├─ QuestionCard
├─ OptionButton × 3
├─ FeedbackToast (correct/incorrect)
└─ CelebrateScreen (score, stars, coins, Play Again / Home)

GamesHubPage → GameTile × 16 (each links to its own route)

GameShell (shared wrapper: header, instructions, exit, GameEngine slot)
├─ BalloonPopGame
├─ MatchingGame
├─ MathLabGame (Addition/Subtraction/Multiplication/Division story views)
├─ MemoryGame / PuzzleGame / ColoringGame (new, real)
└─ GradeGame (Missing Number / Odd or Even / Times Tables / Word Builder / Patterns → reuse QuizSessionPage)

WritingPracticePage
├─ TraceCanvas (guide glyph + freehand stroke capture)
└─ Controls (Clear, Next Guide)

RewardsPage → StatCard × 4 (Stars, Coins, Badges, Lessons) + CertificateBanner
ParentsPage → SummaryCard + ProgressRow × 6 + TimeChart (Recharts)
StudyCoachPage → GradeSelector + GameVariationList | TreasureHunt | DailyRoutine
SettingsPage → LanguageSetting, VoiceToggle, MusicToggle, ResetProgressDialog
```

---

## 5. Page Tree & Route Tree

| Route | Type | Purpose | Data source |
|---|---|---|---|
| `/` | Static (SSG) | Home, category grid | `data/categories` |
| `/learn/[category]` | Static (`generateStaticParams`, 13 slugs) | Category hub | `data/categories/[slug].ts` |
| `/learn/[category]/lesson` | Client-heavy, statically shelled | Flashcard learning | same |
| `/learn/[category]/quiz` | Client | Per-category quiz + celebrate | same |
| `/learn/[category]/practice` | Client (canvas) | Writing/trace (alphabet, numbers, gujarati, hindi only) | same |
| `/quiz` | Client | Mixed quiz (all categories) | all datasets |
| `/games` | Static | Games hub | game registry |
| `/games/[game-slug]` | Client | Individual game | game registry + relevant dataset |
| `/rewards` | Client (reads store) | Stars/coins/badges/certificate | `progressStore` |
| `/parents` | Client (reads store) | Parent dashboard | `progressStore` |
| `/study-coach` | Static shell + client controls | Grade selector entry | static content |
| `/study-coach/game-variations` | Client | Game variation guide | static content |
| `/study-coach/treasure-hunt` | Client | Generated Q&A hunt | static content |
| `/study-coach/daily-routine` | Static | 30-minute routine guide | static content |
| `/settings` | Client | Language/voice/music/reset | `settingsStore` |
| `/offline` | Static | PWA offline fallback | — |

Category slugs: `alphabet`, `numbers`, `math`, `shapes`, `colors`, `animals`, `birds`, `fruits`, `vegetables`, `vehicles`, `body-parts`, `gujarati`, `hindi`.

---

## 6. Shared / Reusable Components

- **Buttons:** `Button` (primary/secondary/ghost/destructive, size variants incl. large touch-target "kid" size), `IconButton`, `PillButton` (replaces Android's `pill()` helper).
- **Cards:** `Card`, `CategoryCard`, `ActionCard` (replaces `bigButton()`), `StatCard` (replaces `stat()`), `SettingRow` (replaces `settingRow()`), `ProgressRow` (replaces `progressRow()`).
- **Modals/Dialogs:** `Dialog` (shadcn) for Reset Progress confirmation, game exit confirmation, "how to play" instructions.
- **Feedback:** `ConfettiOverlay`, `FeedbackToast` (success/error variants, ARIA `role="status"`/`role="alert"`, replaces the Android bottom feedback bar + hand-drawn stars).
- **Navigation:** `Breadcrumbs` (SEO + a11y), `BottomNav`, `SideNav`, `BackButton`.
- **Loading/empty/error states:** `SkeletonCard`, `EmptyState`, `ErrorState` (none of these existed in the Android app — the original has no loading states since everything is synchronous local data).
- **Quiz Engine:** `useQuizEngine(config)` hook — accepts a question generator + item pool, returns `{ question, options, score, round, answer(), status }`. Powers per-category quiz, Mixed Quiz, and all five grade games from one implementation.
- **Game Engine contract:** a common `GameDefinition` interface (`id`, `title`, `icon`, `color`, `component`, `instructions`) registered in `features/games/engine/registry.ts`, rendered through a shared `GameShell`. New games are added by registering a definition, not by writing a new screen from scratch.

---

## 7. Data Models

```ts
// types/item.ts
export interface LearningItem {
  id: string;                 // stable slug, e.g. "alphabet-a"
  symbol?: string;             // e.g. "A", "5", "●" — glyph/number/shape
  icon?: string;                // emoji, decorative
  label: string;                // e.g. "Apple"
  detail: string;                // e.g. "Pronunciation: A" / "Odd • ●●●"
  speech: string;                 // text sent to speech synthesis
  sound?: string;                  // e.g. "Roar" (animal/bird sound word)
  visualColor?: string;             // hex, for color-swatch items
}

// types/category.ts
export interface LearningCategory {
  slug: string;                // "alphabet"
  icon: string;
  title: string;
  subtitle: string;
  color: string;                // hex
  trace: boolean;               // has writing practice
  items: LearningItem[];
}

// types/progress.ts
export interface ProgressState {
  starsByCategory: Record<string, number>;
  bestScoreByCategory: Record<string, number>;
  coins: number;
  lessonsCompleted: number;
  timeSeconds: number;
}

// types/settings.ts
export type AppLanguage = "en" | "gu" | "hi";
export interface SettingsState {
  language: AppLanguage;
  voiceOn: boolean;
  musicOn: boolean;
}

// types/game.ts
export interface GameDefinition {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  component: React.ComponentType;
  instructions: string;
}
```

All 13 category datasets are ported verbatim from the Java arrays (same labels, emoji, sounds) into `data/categories/*.ts`, validated at build time with a Zod schema matching `LearningCategory`.

---

## 8. State Management

| State | Owner | Persistence | Notes |
|---|---|---|---|
| Stars/best-score per category, coins, lessons, time spent | `useProgressStore` (Zustand) | `localStorage` via `persist` middleware | Direct port of the `SharedPreferences "progress"` keys |
| Language, voice, music | `useSettingsStore` (Zustand) | `localStorage` via `persist` middleware | Theme (light/dark) is handled separately by `next-themes`, a new capability the Android app never had |
| Active quiz/game session (question, round, score-in-progress, balloons, match state, trace strokes) | Local component state / feature hooks | None (ephemeral, matches Android's in-memory fields) | Never put in global store — keeps re-renders scoped |
| Theme (light/dark) | `next-themes` | `localStorage` (its own mechanism) | New feature |

SSR hydration: all persisted stores must guard against server/client mismatch (render a neutral/loading state until the store hydrates from `localStorage`, exactly the kind of edge case the Android app never had to deal with).

---

## 9. Android → Web Capability Mapping

| Android capability | Web replacement | Notes |
|---|---|---|
| `TextToSpeech` | Web Speech API (`SpeechSynthesis`), locale `en-US` / `gu-IN` / `hi-IN` | Feature-detect; degrade gracefully (visible captions) where unsupported |
| `ToneGenerator` DTMF win chime | Web Audio API oscillator, 3-note arpeggio | No audio asset needed, matches the "no assets" footprint of the original |
| `Vibrator` | `navigator.vibrate()` | No-op fallback on iOS Safari/desktop (feature-detected, never throws) |
| `SharedPreferences` | Zustand + `persist` → `localStorage` (IndexedDB optional later for larger data) | |
| Manual `hits`/hit-test tap regions | Real `<button>`/`<a>`/ARIA elements | Major accessibility upgrade, not a like-for-like port |
| Manual scroll drag handling | Native scroll containers (`overflow-y-auto`) + optional Framer Motion for polish | |
| Hand-drawn confetti / stars | `ConfettiOverlay` component, respects `prefers-reduced-motion` | |
| Single fullscreen custom View | Full App Router route tree with real URLs per screen | Enables SEO, deep-linking, back/forward browser nav |

---

## 10. SEO Strategy

- Every route exports `generateMetadata` (or static `metadata`) with title, description, keywords, canonical URL, OpenGraph, and Twitter Card.
- JSON-LD: `WebSite`/`Organization` on root layout, `Course`/`LearningResource` structured data per category page, `BreadcrumbList` on all nested routes, `FAQPage` on Study Coach guides where applicable.
- `sitemap.ts` enumerates all static routes (13 categories × their sub-routes + games + static pages); `robots.ts` allows all except any future `/api` routes.
- Static generation (`generateStaticParams`) for all category and game routes — no runtime data fetching is required since content is fully local, so this should hit ISR-free full static generation.
- Semantic HTML throughout (`<main>`, `<nav>`, `<h1>`–`<h3>` hierarchy, `<article>` per flashcard) — the Android app has no semantic structure at all today.
- Descriptive `alt` text / `aria-label` for every emoji/icon used as content (not decoration).

---

## 11. Performance Strategy

- Server Components for all non-interactive shells; `dynamic(() => import(...), { ssr: false })` for canvas-heavy games (Balloon Pop, Trace pad, Matching lines) to keep them out of the initial server bundle.
- `next/font` for two type families: a rounded/playful display face for headings (kid-friendly, Duolingo-esque) and a highly legible body face — both self-hosted, `display: swap`, subset to used scripts (Latin + Gujarati + Devanagari where needed).
- Game loops (Balloon Pop physics, math-lab step animation) driven by `requestAnimationFrame` + refs, not per-frame React state, to avoid the re-render storms a naive port would introduce.
- Route-level code splitting is automatic via the App Router; additionally, each game module is dynamically imported from the Games hub so unrelated game code never loads on `/games`.
- Static data modules (category content) are plain TypeScript, tree-shaken and bundled at build time — zero runtime parsing cost, unlike the Android app's per-instantiation array construction on every `EnhancedLearningView` creation.
- Speech/audio contexts are lazily constructed on first user gesture (`AudioContext`, `SpeechSynthesis`) to respect browser autoplay policies and avoid blocking initial load.
- Target Lighthouse 100/100/100/100 checked in CI on the built output (see §14).

---

## 12. Accessibility Strategy (WCAG AA)

- Every interactive region becomes a real focusable element with visible focus rings (the Android app has none).
- Keyboard support for all quiz/option selection, settings toggles, and navigation; games that are inherently pointer-based (Balloon Pop) get a keyboard-accessible alternate mode (e.g., cycle + select via arrow keys/Enter) rather than being keyboard-inaccessible.
- `aria-live="polite"` region mirrors spoken feedback as visible/announced text, so hearing-impaired users get the same "Great job!" / "Try again" signal the Android app only delivered via TTS + a colored toast.
- Respect `prefers-reduced-motion` for confetti, balloon physics, and math-lab step animations.
- Color contrast audit of the ported category palette (purple `#6C5CE7`, red `#EE6352`, etc.) against text/background in both light and dark themes; adjust any combination that fails AA.
- Minimum 44×44px touch targets everywhere (the Android `bigButton`/card sizes are already roughly in this range and will be preserved/increased).
- Full heading hierarchy per page (`h1` per route, no skipped levels) — nonexistent in the Android app today.

---

## 13. Testing Strategy

- **Unit (Vitest):** quiz distractor selection, math-lab example generator, grade-game question generators, progress-store reducers, speech-locale detection, Zod schema validation for datasets.
- **Component (React Testing Library):** `QuizEngine`, `FlashCard`, `SettingsPanel`, `GameShell` — behavioral tests (answer selection updates score, settings toggles persist).
- **E2E (Playwright):** smoke test every route, full quiz-completion flow, PWA install + offline load, language switch affecting speech locale.
- **Accessibility (axe-core via Playwright):** run on every route in CI; fail build on new violations.
- **Regression guard:** since the Android source-of-truth content (letters/words/numbers) must be preserved exactly, add a snapshot test comparing each `data/categories/*.ts` module's item count/labels against the documented inventory in §1.3.

---

## 14. Deployment Strategy

- Host on Vercel; PR preview deployments; production deploy from `main`.
- CI (GitHub Actions): install (pnpm) → typecheck → lint → unit/component tests → build → Lighthouse CI budget check → Playwright smoke + a11y suite → deploy.
- PWA: `manifest.ts`, service worker (Workbox or `next-pwa`) caching the app shell, fonts, and static category data for full offline use — matching the Android app's "works fully offline" claim (footer text: *"App works fully offline"*).
- No backend/API required for v1 (all content and progress are client-local), so no database or serverless function cold-start concerns; leaves room to add an optional account/cloud-sync API route later without restructuring.

---

## 15. Potential Improvements Over the Android App

1. **Real accessibility** — screen reader + full keyboard support, impossible in the canvas-drawn original.
2. **Dark mode** — the Android app is light-only.
3. **Finish the stubbed games** — Memory Game, Drag and Drop, Puzzle, Find Correct Answer, Coloring, Drawing currently just redirect to a generic mixed quiz; build them as real mini-games using the shared Game Engine.
4. **Better distractor logic** — the original's quiz falls back to a literal `"?"` option when a category doesn't have enough unique labels (visible in `nextQuestion()`); the web Quiz Engine should guarantee 3 real, sensible options always.
5. **Richer parent dashboard** — add trend charts (Recharts) for time spent and topics attempted over time, not just cumulative totals.
6. **Streaks/daily goals** — a lightweight retention mechanic in the Duolingo family that the Android app doesn't have.
7. **Adjustable speech rate / captions toggle** — helps auditory-processing and hearing-impaired users; today TTS is the only feedback channel for some interactions.
8. **Custom illustrations** — replace bare emoji with a cohesive mascot + SVG illustration set for the "premium" feel the brief asks for, while keeping emoji as an accessible text alternative under the hood.
9. **Optional cloud sync** — today progress is device-local only (`SharedPreferences`); an opt-in account system would let a child's progress follow them across devices.

---

## 16. Implementation Order (unchanged from brief, restated for tracking)

1. Home · 2. Navigation · 3. Shared Components · 4. Theme · 5. Layout · 6. Alphabet · 7. Numbers · 8. Shapes · 9. Colors · 10. Animals · 11. Birds · 12. Fruits · 13. Vegetables · 14. Vehicles · 15. Body Parts · 16. Gujarati · 17. Hindi · 18. Math · 19. Writing Practice · 20. Quiz Engine · 21. Games · 22. Parent Dashboard · 23. Progress Tracking · 24. Achievements · 25. Settings · 26. Offline Support · 27. PWA · 28. SEO · 29. Performance Optimization · 30. Final Refactoring

Each module will be delivered individually: plan → create files → implement → verify imports/routing/TypeScript → confirm accessibility/responsiveness → move to the next module. No module will be started until the previous one builds and type-checks cleanly.

---

*Next step: confirm this plan, then begin Module 1 (Home) — project scaffold (Next.js + TypeScript strict + Tailwind + shadcn/ui + pnpm), root layout, theme provider, and the Home page with the category grid.*
