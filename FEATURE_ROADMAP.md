# Happy Kids Academy — Post-Migration Feature Roadmap

**Status:** Draft for review. Source: brainstorm list of 24 "beyond flashcards" feature ideas (2026-08-07).
**Companion doc:** [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) — read that first for the current architecture; this doc assumes it.

This doc takes the raw brainstorm and sorts it by what it actually costs to build against the app *as it exists today*, not against a generic kids-app. That matters here more than usual, because the current app has some load-bearing constraints:

- **Fully static, zero backend.** `next.config.ts` uses `output: "export"`; there is no server, no database, no API routes. Progress lives in `localStorage` via Zustand. Anything that needs a server call (an LLM, a leaderboard, cloud storage) is a *new* architectural category, not a feature.
- **No image or audio assets today.** Every "character" is a Unicode emoji drawn as text (🦁, 🍎...). There are no sprite sheets, no Lottie files, no animal sound recordings — the only synthesized audio is a Web Audio chime, and speech comes from the Web Speech API (`speechSynthesis`), not recordings. Several ideas below quietly assume Pixar-style animated characters; those need a new art/audio pipeline, not just code.
- **Wrapped in Capacitor for Android**, but currently uses zero native plugins beyond splash/app-info — `navigator.vibrate` and Web Speech already work in the WebView for free. Microphone or camera access would be the *first* features requiring a Capacitor permission (`AndroidManifest.xml` entries + a plugin like `@capacitor/microphone`/`@capacitor/camera` or raw `getUserMedia`), and a runtime permission prompt flow that doesn't exist yet.
- **Engines, not one-offs** is the stated architecture principle (§2 of the migration plan) — a reusable Quiz Engine and Game Engine already exist. New features should slot into `src/features/games/engine/` or spawn a new engine (e.g., a "Living Scene" engine) rather than each becoming a bespoke one-off, which is exactly the anti-pattern the migration was meant to fix.

## How to read the tiers

| Tier | Meaning | Typical effort |
|---|---|---|
| **1 — Ship now** | Buildable with current deps (Framer Motion, Zustand, Web Speech API), emoji/CSS-based, no new permissions, no new asset pipeline | Days |
| **2 — Needs a content pipeline** | Code is straightforward, but needs new *assets* that don't exist yet: character sprite animations, real sound-effect files, or a drag-and-drop interaction pattern not yet in the codebase | 1–2 weeks, mostly art/audio sourcing |
| **3 — Needs a new device capability** | Requires `getUserMedia` (mic and/or camera) — new Capacitor permissions, a permission-request UX, and (for face/gesture detection) a client-side ML library | 2–4 weeks; first-of-its-kind for this app |
| **4 — Needs new architecture** | Breaks the "fully static, no backend" model — requires a server call (LLM API), which means hosting, API-key handling, cost-per-use, and an offline fallback story | Largest lift; a platform decision, not just a feature |

---

## Tier 1 — Ship now (existing stack, no new permissions)

| # | Idea | Feasibility note | Suggested home |
|---|---|---|---|
| 7 | **Living Alphabet** | Animate the existing 26 letter emoji + example-word emoji with Framer Motion (grow/land/walk-across keyframes) on the existing flash-card. Pure animation polish on data that's already there. | Extend `features/learn/flash-card.tsx` |
| 8 | **Sleepy Animals** | Day/night is a CSS/gradient background swap + a settings/time-of-day flag; yawn/close-eyes is a Framer Motion sequence on the existing animal emoji. No new assets required for a v1 (emoji "😴" states). | New `features/living-world/` (shared by #17, #20, #23 below) |
| 10 | **Emotional Animals** | Swap the item's emoji per emotion state (already how "detail/speech" fields work per `Item`) + a short animation. Genuinely just data + Framer Motion. | Extend `data/categories/animals.ts` (add `emotions` field) + `features/learn` |
| 14 | **Guess By Shadow** | CSS `filter: brightness(0)` or a silhouette mask on the existing emoji/SVG, plus the existing quiz-option pattern for the answer. | New mini-game under `features/games/`, reuses Quiz Engine |
| 15 | **Animal Family** | Pure content addition — extend each animal's data record with mother/father/baby variants + a "relationships" quiz mode reusing the Quiz Engine. | Extend `data/categories/animals.ts` + `features/quiz` |
| 17 | **Rain Mode** | CSS/Framer Motion rain overlay + per-animal reaction emoji swap on tap. Same pattern as #8. | `features/living-world/` |
| 18 | **Touch Anywhere** | Requires hit-testing sub-regions of an emoji-based character, which is the one real gap — emoji have no separate "ear"/"tail" hitboxes. **v1 workaround:** use a simple SVG or divided hotspot overlay (invisible regions over the emoji) rather than true body-part detection. Doable, but design effort > code effort. | New `features/games/touch-anywhere/` |
| 20 | **Real Size Zoom** | Pinch-to-zoom via Framer Motion's drag/gesture API or native CSS `touch-action`, scaling two emoji relative to a size-ratio data field. No new deps. | New `features/games/real-size/` |
| 23 | **Emotion-Based Learning (mood picker)** | A pre-session "how do you feel?" screen that sets a Zustand flag, which existing screens (quiz difficulty, animation speed, music) branch on. Pure state-machine work. | `store/settingsStore.ts` + a new onboarding step |
| — | **Hide & Seek (simplified)** | Tap-to-reveal behind a static CSS shape (tree/bush/cloud) + confetti (already have `ConfettiOverlay`). Full "voice says find the monkey" needs TTS prompts, which the app already has via Web Speech. | New `features/games/hide-and-seek/` |

These ten are the highest-leverage place to start: they cost days, use nothing new, and most of them (Living Alphabet, Sleepy Animals, Emotional Animals, Rain Mode) share one underlying need — **animated per-item states** — which argues for building one small "Living Scene" engine once and reusing it four times, rather than four bespoke features.

---

## Tier 2 — Needs a content pipeline (new assets, same permissions)

| # | Idea | What's actually needed | Suggested home |
|---|---|---|---|
| 2 | **Feed the Animal** | Drag-and-drop already exists (`features/games/drag-and-drop`) — the sorting-game hook is directly reusable. The only new work is content: a "hungry" prompt line + funny wrong-answer reaction lines per animal/food pair (text, spoken via existing TTS — no new audio needed). | Extend `features/games/drag-and-drop/` |
| 4 | **Animal Dance Party** | Needs short looping character animations (idle/dance) — emoji can't convincingly "dance" past a bounce/rotate. Realistic v1: 2–3 CSS keyframe dance loops per animal (bounce, wiggle, spin) rather than true sprite animation; real sprite/Lottie work is a bigger lift. Also needs a rhythm-tap detector (timing math, no new lib). | New `features/games/dance-party/` |
| 6 | **Draw With Fireflies** | This is a *new* canvas interaction distinct from the existing trace pad (`features/writing-practice`) — fireflies need particle-following-finger physics. Buildable with Framer Motion + canvas, but it's new code, not a reskin of trace practice. | New `features/games/firefly-draw/`, can share `use-trace-pad.ts`'s pointer-tracking logic |
| 11 | **Build Your Own Zoo** | Coins/progression already exist (`rewards/`, `progressStore`). New work: an "unlock and place items in a scene" builder UI + persisting zoo layout to Zustand/localStorage. This is the biggest *pure-code* lift in the list because it's a new persistent data model, not just a screen. | New `features/zoo-builder/` + extend `store/progressStore.ts` |
| 12 | **Animal Orchestra** | "Makes real sounds" needs actual instrument sound-effect files (drum/trumpet/piano/guitar clips) — the app has zero audio files today, only a synthesized chime. Small asset addition (short royalty-free clips in `public/sounds/`), but it's a first for this codebase's audio pipeline. | New `features/games/orchestra/` + `public/sounds/` |
| 16 | **Rescue Mission** | Genuinely a new content type: short branching mini-stories with a goal state. Reuses Quiz/Game Engine patterns for the "find/help" interaction but the story content itself (bird trapped, monkey's banana, penguin slipping) needs writing. | New `features/rescue-missions/` |
| 21 | **Magic Sticker Book** | "Every sticker is alive" again implies small looping animations per unlocked item — same animation-asset question as #4. Scene composition (drag stickers into farm/ocean/jungle/space backgrounds) is new but straightforward drag-and-drop UI. | New `features/sticker-book/` |
| 24 | **Tiny Scientist Lab** | Color mixing, seed growth, freezing are all CSS/Framer Motion state transitions on existing shapes/colors data — no new capability, but each "experiment" is its own small animation sequence to design, hence Tier 2 not Tier 1. | New `features/games/science-lab/` |

---

## Tier 3 — Needs a new device capability (mic and/or camera)

| # | Idea | What's actually needed |
|---|---|---|
| 1 | **Magic Touch Animals (full version)** | The "jumps out of the card, runs around the screen, real sounds" part is Tier 2 (animation + audio assets, same as #4/#12). The "child roars, AI detects loudness" part is Tier 3: needs `getUserMedia` mic access + `AnalyserNode` (Web Audio, already a dependency area) for volume detection — no speech-to-text needed, just amplitude, which keeps this simpler than it sounds. Still: first mic-permission flow in the app, and a Capacitor `android.permission.RECORD_AUDIO` entry that isn't in `AndroidManifest.xml` today. |
| 5 | **Mirror Animal** | Needs `getUserMedia` camera + a face-detection model running client-side (e.g., MediaPipe FaceMesh or TensorFlow.js face-landmarks-detection via CDN/npm). This is a real new dependency and a meaningfully larger JS bundle for a static-export app — worth prototyping in isolation before committing, since bundle size affects the Capacitor app's cold-start too. |
| 13 | **Magic Camera** | Same camera dependency as #5, plus compositing an animated character over live video ("AR-lite") — more animation-asset work stacked on top of the camera capability. This is the single most expensive item on the list technically. |

Ship #1's loudness-detection half on its own first — it's genuinely low-risk (no ML model, just `AnalyserNode`) and it validates the mic-permission plumbing (Android manifest + runtime prompt + graceful "mic denied" fallback) that #5 and #13 would also need, before investing in a face-detection library.

---

## Tier 4 — Needs new architecture (breaks "no backend")

| # | Idea | Why this is different in kind |
|---|---|---|
| 22 | **AI Story Generator** | Every other idea on this list is client-only. This one needs a live LLM call, which means: (a) a server or edge function to hold an API key (never ship an LLM key in a static-export client bundle), (b) a per-generation cost, (c) content-safety filtering for anything shown to small children, and (d) an offline fallback since the rest of the app deliberately works with no network. This is a "do we want a backend at all" decision for the project, not a feature ticket — worth scoping separately once someone decides the offline-first constraint can flex for this one screen. |
| 19 | **Animal Conversation** | Listed here only if built as *dynamically generated* dialogue (per the pitch, "feels like cartoons," implying novel lines each time). A **scripted version** — a handful of pre-written, TTS-voiced multi-animal exchanges — is actually Tier 1/2 and ships without any backend; only the open-ended generative version needs the Tier 4 investment. Recommend building the scripted version first. |
| 3 | **Hide & Seek Mode (voice-directed variant)** | Noted above as Tier 1 in its simplified form. If "voice says 'find the monkey'" is meant to mean *the app dynamically picks and names any animal via generated speech*, that's just TTS reading a data string — no LLM needed. No Tier 4 dependency here; flagging only so it isn't confused with #22. |

---

## Recommended build order

Reordering the six-feature "combination" from the brainstorm by what the current codebase actually supports, cheapest/lowest-risk first:

1. **Living-world basics (Tier 1 bundle):** Living Alphabet, Sleepy Animals, Emotional Animals, Rain Mode, Emotion-based mood picker. Ship these together as one small "Living Scene" engine — same underlying animated-state pattern reused five times. This alone would make the app feel meaningfully more alive with no new dependencies.
2. **Feed the Animal.** Reuses the existing drag-and-drop engine almost as-is; highest "wow per hour of work" item on the list.
3. **Build Your Own Zoo.** The one with real long-term retention value (per the brainstorm's own framing) — start it once #1–2 exist, since it's the natural place to spend the coins/stars they generate.
4. **Rescue Missions + a scripted Animal Conversation.** Story-driven content that reuses the Quiz/Game Engine; do these together since both are primarily *writing* work, not new code.
5. **Magic Touch Animals — loudness-detection only.** First mic-permission feature; validates the permission/fallback flow cheaply before investing further.
6. **Mirror Animal, then Magic Camera** — only after #5 proves the permission flow works well on real Android devices, and only after evaluating face-detection bundle-size impact in a throwaway spike.
7. **AI Story Generator** — treat as a separate architecture proposal (needs a decision on adding a backend/edge function), not part of the same sprint as the rest.

Everything not explicitly listed above (Dance Party, Draw With Fireflies, Orchestra, Sticker Book, Tiny Scientist Lab, Touch Anywhere, Real Size Zoom, Guess by Shadow, Animal Family) is good backlog — Tier 1/2, no sequencing dependency on the others — and can be slotted in opportunistically between the phases above.

## Open decisions before starting

- **Art/audio budget:** several Tier 2/3 items assume animated characters and real sound effects that don't exist in this project today (it has shipped entirely on emoji + synthesized tones). Worth deciding up front whether to source/commission a small animation-asset pack once, rather than one-off per feature.
- **Mic/camera on Android:** the Capacitor Android wrapper has never requested a runtime permission. Budget time for testing the permission-denied path specifically — this is a kids' app, and parents controlling device permissions is a realistic scenario the UX needs to handle gracefully.
- **AI Story Generator's backend:** confirm whether "no server-side dependencies" is a hard constraint for the whole app or just an implementation detail so far — that answer determines whether #22 is in scope at all.
