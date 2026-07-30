import { LevelBadge } from "@/components/shared/level-badge";

export function HomeHero() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-lg sm:p-8">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Happy Kids Academy
      </h1>
      <p className="mt-1 text-sm text-white/85 sm:text-base">Learn • Play • Grow ✨</p>
      <div className="mt-4">
        <LevelBadge />
      </div>
    </section>
  );
}
