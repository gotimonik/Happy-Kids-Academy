"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/use-translation";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const t = useTranslation();

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
    >
      <TriangleAlert className="size-10 text-destructive" aria-hidden="true" />
      <h2 className="font-display text-lg font-bold">{title ?? t("error.title")}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description ?? t("error.description")}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("common.tryAgain")}
        </Button>
      )}
    </div>
  );
}
