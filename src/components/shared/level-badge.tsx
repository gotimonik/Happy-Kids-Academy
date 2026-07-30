"use client";

import { selectLevel, useProgressStore } from "@/store/progress-store";
import { Badge } from "@/components/ui/badge";

export function LevelBadge() {
  const level = useProgressStore(selectLevel);
  return <Badge variant="success">Level {level}</Badge>;
}
