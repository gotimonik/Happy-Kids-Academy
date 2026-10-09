import { DailyChallengeBadge } from "@/components/shared/daily-challenge-badge";
import { LevelBadge } from "@/components/shared/level-badge";
import { StreakFlameBadge } from "@/components/shared/streak-flame-badge";

/** Intrinsic size of the banner artwork (`public/images/banner-*.webp`,
 * resized from `public/images/produce/banner.png`). Passed as the `<img>`'s
 * width/height so the browser reserves the right-shaped box before the
 * image loads and the category grid below doesn't jump down. */
const BANNER_WIDTH = 1794;
const BANNER_HEIGHT = 877;

/**
 * Home page hero: the Happy Kids Academy brand banner, with the child's
 * level / streak / daily-challenge badges in a row underneath.
 *
 * Rendered statically (no client-only gating or entrance animation), so the
 * banner is in the exported HTML and paints immediately — on the web and in
 * the native apps alike. The badges read persisted progress and already
 * render their own pulsing placeholders until the store hydrates.
 *
 * The banner's lettering is artwork, so the page's `<h1>` stays in the DOM
 * for screen readers and SEO, visually hidden, and the image's `alt`
 * carries what the artwork says.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="flex flex-col gap-3">
      <h1 id="home-hero-title" className="sr-only">
        Happy Kids Academy
      </h1>
      <div className="overflow-hidden rounded-3xl bg-[#BDE3F7] shadow-lg">
        {/* Plain <img>: `output: "export"` has no image optimizer, so
            next/image would add nothing here; srcSet does the sizing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/banner-1794.webp"
          srcSet="/images/banner-900.webp 900w, /images/banner-1794.webp 1794w"
          // Content column width: full width minus page padding on phones; minus
          // padding + SideNav (14rem) + gap from `md`; capped by max-w-6xl.
          sizes="(min-width: 1152px) 840px, (min-width: 768px) calc(100vw - 19.5rem), calc(100vw - 2rem)"
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          alt="Happy Kids Academy — Learn, play and grow every day! Alphabet and phonics, numbers and counting, colors and shapes, animals and words, puzzles and games. Fun and interactive learning for kids."
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <LevelBadge />
        <StreakFlameBadge />
        <DailyChallengeBadge />
      </div>
    </section>
  );
}
