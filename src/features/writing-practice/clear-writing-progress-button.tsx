"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics/track-event";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useWritingPracticeStore } from "@/store/writing-practice-store";
import type { CategorySlug } from "@/types/category";

/**
 * Scoped "Clear Progress" control for one category's writing practice —
 * wipes its traced-letter scores and resume position only, leaving stars,
 * coins, quiz progress, and every other category untouched. Mirrors the
 * confirm-dialog pattern of Settings' global "Reset Progress"
 * (`settings-panel.tsx`), just narrowed to one category and one feature.
 */
export function ClearWritingProgressButton({
  categorySlug,
  categoryTitle,
}: {
  categorySlug: CategorySlug;
  categoryTitle: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const clearCategoryProgress = useWritingPracticeStore((state) => state.clearCategoryProgress);
  const t = useTranslation();

  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="mx-auto text-muted-foreground">
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("practice.clearProgress")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("practice.clearConfirmTitle")}</DialogTitle>
          <DialogDescription>{t("practice.clearConfirmDescription", { category: categoryTitle })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              clearCategoryProgress(categorySlug);
              trackEvent("writing_progress_clear", { category: categorySlug });
              setConfirmOpen(false);
            }}
          >
            {t("practice.clearConfirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
