"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ConfettiOverlay } from "@/components/shared/confetti-overlay";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * The "you're done" popup every game with a genuine finish line (as opposed
 * to an endless practice loop like Matching or Math Lab, which never fires
 * this) shows on completion — Memory, Puzzle, Sorting, Simon Pattern, Sound
 * Safari, Speed Round.
 *
 * Before this, each game rendered its own "you win" block as a plain
 * in-flow `<div>` appended after the board — easy to miss entirely on a
 * tall board (the exact complaint: Memory Game's grid can run below the
 * fold, so "All pairs matched!" sat off-screen until you scrolled down to
 * it). A modal instead appears centered over the viewport the instant the
 * game finishes, wherever the player happens to be looking.
 *
 * `trigger` is the game's own completion boolean (`isComplete`,
 * `status === "finished"`, etc.) — this component tracks its OWN `open`
 * state internally and only opens on `trigger`'s rising edge (false → true).
 * That split matters: `trigger` typically stays true forever once a game is
 * won (there's no "un-complete" action), so if `open` mirrored it directly
 * the player could never dismiss the popup to look at the finished board
 * underneath — closing it would just have it snap back open on every
 * re-render. Tracking the edge instead means the popup can be dismissed
 * (backdrop click, Escape, the built-in close button) and only reappears
 * once `trigger` has gone back to `false` (via Play Again) and then `true`
 * again (finishing a fresh round).
 */
export function GameCompleteModal({
  trigger,
  title,
  description,
  onPlayAgain,
  accentColor = "var(--success)",
  celebrate = true,
}: {
  /** The game's own "finished" condition. */
  trigger: boolean;
  title: string;
  /** Stats/result line(s) — e.g. "Moves: 16 • Pairs found: 6 / 6". */
  description?: ReactNode;
  onPlayAgain: () => void;
  /** Defaults to the app's success green; pass `"var(--destructive)"` for a game-over-by-losing ending (Simon Pattern) rather than a genuine win. */
  accentColor?: string;
  /** Skips the confetti burst — set false alongside a non-default `accentColor` for a losing ending, so it doesn't read as a celebration. */
  celebrate?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    // Synchronizing with an external system (the game's own completion
    // state), not deriving one piece of React state from another — the same
    // case `use-store-hydrated.ts` and `PracticePageClient`'s resume-index
    // effect document this lint rule for. `open` deliberately does NOT just
    // mirror `trigger`: see this component's own doc for why it only reacts
    // to the false-to-true edge instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (trigger) setOpen(true);
  }, [trigger]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && celebrate && <ConfettiOverlay />}
      <DialogContent className="text-center">
        <DialogHeader className="items-center text-center">
          <span
            aria-hidden="true"
            className="mb-1 flex size-16 items-center justify-center rounded-full text-4xl"
            style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 16%, transparent)` }}
          >
            {celebrate ? "🎉" : "🎮"}
          </span>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Button
          type="button"
          size="md"
          accentColor={accentColor}
          className="w-full text-white hover:brightness-110"
          onClick={() => {
            setOpen(false);
            onPlayAgain();
          }}
        >
          {t("common.playAgain")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
