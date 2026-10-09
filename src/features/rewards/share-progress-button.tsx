"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { renderProgressCard, type ProgressCard } from "@/lib/rewards/progress-card";
import { shareProgress, type ProgressShareData } from "@/lib/rewards/share-progress";

type Status = "idle" | "working" | "shared" | "copied" | "error";

// How long the "Shared!"/"Link copied!"/error message stays up before reverting.
const FLASH_MS = 2500;

export function ShareProgressButton(data: ProgressShareData) {
  const [status, setStatus] = useState<Status>("idle");
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The progress-card image, drawn ahead of the tap (see `shareProgress`)
  // and redrawn whenever the numbers change. `null` until ready, or if it
  // couldn't be drawn — sharing then falls back to the link.
  const cardRef = useRef<ProgressCard | null>(null);
  const { level, stars, coins, badges, lessonsCompleted } = data;

  useEffect(() => {
    let cancelled = false;
    cardRef.current = null;
    renderProgressCard({ level, stars, coins, badges, lessonsCompleted })
      .then((card) => {
        if (!cancelled) cardRef.current = card;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [level, stars, coins, badges, lessonsCompleted]);

  useEffect(() => {
    return () => {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, []);

  function flash(next: Status) {
    setStatus(next);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setStatus("idle"), FLASH_MS);
  }

  async function handleShare() {
    setStatus("working");
    try {
      const outcome = await shareProgress(data, cardRef.current);
      if (outcome === "cancelled") {
        // The person backed out of the native share sheet — not an error,
        // just quietly go back to normal with no message.
        setStatus("idle");
      } else if (outcome === "failed") {
        flash("error");
      } else {
        flash(outcome);
      }
    } catch {
      flash("error");
    }
  }

  const label =
    status === "working"
      ? "Preparing your picture…"
      : status === "shared"
        ? "Shared!"
        : status === "copied"
          ? "Link copied!"
          : status === "error"
            ? "Couldn't share — try again"
            : "Share my progress";

  return (
    <Button type="button" size="md" className="w-full" onClick={handleShare} disabled={status === "working"}>
      {status === "working" ? (
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      ) : status === "shared" || status === "copied" ? (
        <Check className="size-5" aria-hidden="true" />
      ) : (
        <Share2 className={cn("size-5", status === "error" && "text-destructive")} aria-hidden="true" />
      )}
      {label}
    </Button>
  );
}
