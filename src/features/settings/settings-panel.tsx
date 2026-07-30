"use client";

import { useState } from "react";
import { Globe, Music, RotateCcw, Volume2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { trackEvent } from "@/lib/analytics/track-event";
import { useProgressStore } from "@/store/progress-store";
import { useSettingsStore } from "@/store/settings-store";
import { LANGUAGE_LABELS } from "@/types/settings";

function SettingRow({
  icon,
  label,
  control,
}: {
  icon: React.ReactNode;
  label: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-muted-foreground">
          {icon}
        </span>
        <span className="font-display font-bold">{label}</span>
      </div>
      {control}
    </div>
  );
}

export function SettingsPanel() {
  const language = useSettingsStore((state) => state.language);
  const voiceOn = useSettingsStore((state) => state.voiceOn);
  const musicOn = useSettingsStore((state) => state.musicOn);
  const cycleLanguage = useSettingsStore((state) => state.cycleLanguage);
  const toggleVoice = useSettingsStore((state) => state.toggleVoice);
  const toggleMusic = useSettingsStore((state) => state.toggleMusic);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <SettingRow
        icon={<Globe className="size-5" />}
        label="Language"
        control={
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              cycleLanguage();
              trackEvent("language_change");
            }}
          >
            {LANGUAGE_LABELS[language]}
          </Button>
        }
      />
      <SettingRow
        icon={<Volume2 className="size-5" />}
        label="Voice"
        control={<Switch checked={voiceOn} onCheckedChange={toggleVoice} aria-label="Toggle voice" />}
      />
      <SettingRow
        icon={<Music className="size-5" />}
        label="Music"
        control={<Switch checked={musicOn} onCheckedChange={toggleMusic} aria-label="Toggle music" />}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <button type="button" className="w-full text-left">
            <SettingRow
              icon={<RotateCcw className="size-5" />}
              label="Reset Progress"
              control={<span className="text-sm text-muted-foreground">Tap to reset</span>}
            />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This clears stars, coins, badges, and lesson history. Language and sound settings are
              kept. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetProgress();
                trackEvent("reset_progress");
                setConfirmOpen(false);
              }}
            >
              Reset progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        This app works fully offline once loaded.
      </p>
      <p className="text-center text-xs text-muted-foreground">Happy Kids Academy</p>
    </div>
  );
}
