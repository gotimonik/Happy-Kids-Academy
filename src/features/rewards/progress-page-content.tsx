"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Award, CheckCircle2, Coins, Star } from "lucide-react";
import { StaticLink } from "@/components/shared/static-link";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track-event";
import { parseProgressParams } from "@/lib/rewards/progress-url";
import { heroGradient } from "@/lib/ui/tile-gradient";
import { RewardStatCard } from "./reward-stat-card";

/**
 * The public page a shared "my progress" link actually opens. Anyone can
 * land here — a friend, a grandparent, whoever the link was sent to — with
 * no app install and no account needed, since the stats are encoded right in
 * the URL (see src/lib/rewards/progress-url.ts). Being a real, navigable
 * page (rather than an attached image) means opening it is a normal page
 * visit, so it shows up in analytics — that visibility was the whole reason
 * for building this instead of just sharing a picture.
 */
export function ProgressPageContent() {
  const searchParams = useSearchParams();
  const data = parseProgressParams(searchParams);

  useEffect(() => {
    // A distinct, explicitly-named event rather than relying only on the
    // generic page_view GA already sends for every route — this makes it
    // easy to see "how many times has a shared progress link been opened"
    // on its own, separate from normal in-app navigation.
    trackEvent(
      "progress_link_opened",
      data
        ? { level: data.level, stars: data.stars, coins: data.coins, badges: data.badges }
        : { level: 0, stars: 0, coins: 0, badges: 0 },
    );
    // Only ever fire once, on the initial open of this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return <GenericInvite />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative w-full overflow-hidden rounded-3xl p-6 text-center text-white shadow-lg sm:p-8"
        style={heroGradient()}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span aria-hidden="true" className="absolute -right-10 -top-12 size-40 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute -left-12 -bottom-16 size-40 rounded-full bg-black/10 blur-md" />

        <p aria-hidden="true" className="relative text-6xl drop-shadow-sm">
          🏆
        </p>
        <h1 className="relative mt-2 font-display text-2xl font-bold">Level {data.level}</h1>
        <p className="relative mt-1 text-sm font-semibold text-white/85">
          Playing and learning on Happy Kids Academy
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <RewardStatCard icon={<Star className="fill-current" />} label="Stars" value={data.stars} accentColor="#FFD166" />
        <RewardStatCard icon={<Coins />} label="Coins" value={data.coins} accentColor="#E17055" />
        <RewardStatCard icon={<Award />} label="Badges" value={data.badges} accentColor="#6C5CE7" />
        <RewardStatCard
          icon={<CheckCircle2 />}
          label="Lessons"
          value={data.lessonsCompleted}
          accentColor="#37C183"
        />
      </div>

      <p className="max-w-sm text-center text-sm font-semibold text-muted-foreground">
        Come learn and play together — it&apos;s free, works offline, and there are no ads or accounts.
      </p>

      <Button asChild size="kid" className="w-full max-w-xs">
        <StaticLink href="/">Try Happy Kids Academy</StaticLink>
      </Button>
    </div>
  );
}

function GenericInvite() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div
        className="relative w-full overflow-hidden rounded-3xl p-8 text-white shadow-lg"
        style={heroGradient()}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <p aria-hidden="true" className="relative text-6xl drop-shadow-sm">
          🏆
        </p>
        <h1 className="relative mt-2 font-display text-2xl font-bold">Happy Kids Academy</h1>
        <p className="relative mt-1 text-sm font-semibold text-white/85">
          A joyful, free learning world for young children.
        </p>
      </div>
      <p className="max-w-sm text-sm font-semibold text-muted-foreground">
        Alphabet, numbers, math, shapes, colors, animals, quizzes, and games — free, offline, no ads or accounts.
      </p>
      <Button asChild size="kid" className="w-full max-w-xs">
        <StaticLink href="/">Explore Happy Kids Academy</StaticLink>
      </Button>
    </div>
  );
}
