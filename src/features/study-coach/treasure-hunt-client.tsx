"use client";

import { treasureHuntEntries } from "@/lib/study-coach/guide-content";
import { useStudyCoachStore } from "@/store/study-coach-store";
import { GuideList } from "./guide-list";

export function TreasureHuntClient() {
  const grade = useStudyCoachStore((state) => state.grade);
  const entries = treasureHuntEntries(grade);

  return <GuideList entries={entries} accentColor="#00B894" />;
}
