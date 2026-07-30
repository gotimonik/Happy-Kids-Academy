"use client";

import { gameVariationEntries } from "@/lib/study-coach/guide-content";
import { useStudyCoachStore } from "@/store/study-coach-store";
import { GuideList } from "./guide-list";

export function GameVariationsClient() {
  const grade = useStudyCoachStore((state) => state.grade);
  const gameIndex = useStudyCoachStore((state) => state.gameIndex);
  const entries = gameVariationEntries(grade, gameIndex);

  return <GuideList entries={entries} accentColor="#E17055" />;
}
