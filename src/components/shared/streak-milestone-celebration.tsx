"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics/track-event";
import { useChime } from "@/lib/audio/use-chime";
import { useTranslation } from "@/lib/i18n/use-translation";
import { coinsForMilestone, useStreakStore } from "@/store/streak-store";

/**
 * Celebrates the moment the daily streak (`streak-store.ts`) lands on a
 * milestone — confetti, a win chime, and a modal announcing the coin bonus
 * just credited. Mounted once in the root layout (next to `StreakTracker`,
 * which is what actually sets `celebratingMilestone`) so it can fire no
 * matter which page the child happens to open the app on.
 */
export function StreakMilestoneCelebration() {
  const milestone = useStreakStore((state) => state.celebratingMilestone);
  const acknowledge = useStreakStore((state) => state.acknowledgeMilestone);
  const { playWinChime } = useChime();
  const t = useTranslation();

  const open = milestone !== null;

  useEffect(() => {
    if (milestone === null) return;
    playWinChime();
    trackEvent("streak_milestone", { days: milestone });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per new milestone, not on every chime-fn identity change
  }, [milestone]);

  const coins = milestone !== null ? coinsForMilestone(milestone) : 0;

  return (
    <>
      {open && <ConfettiOverlay />}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) acknowledge();
        }}
      >
        <DialogContent className="text-center">
          <DialogHeader>
            <p aria-hidden="true" className="animate-float mx-auto text-6xl drop-shadow-sm">
              🔥
            </p>
            <DialogTitle className="text-center font-display text-2xl">
              {t("streak.milestoneTitle", { days: milestone ?? 0 })}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("streak.milestoneDescription", { coins })}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={acknowledge} className="mt-2 w-full">
            {t("streak.milestoneButton")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
