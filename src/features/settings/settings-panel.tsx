"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Globe, Music, RotateCcw, Settings as SettingsIcon, Volume2 } from "lucide-react";
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
import { Skeleton } from "@/components/shared/skeleton-card";
import { Switch } from "@/components/ui/switch";
import { useStoreHydrated } from "@/lib/use-store-hydrated";
import { tileGradient } from "@/lib/ui/tile-gradient";
import { trackEvent } from "@/lib/analytics/track-event";
import { useProgressStore } from "@/store/progress-store";
import { useSettingsStore } from "@/store/settings-store";
import { LANGUAGE_LABELS } from "@/types/settings";

const SETTINGS_COLOR = "#636E72";

function SettingRow({
  icon,
  label,
  control,
  accentColor,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  control: React.ReactNode;
  accentColor: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.3, ease: "easeOut" }}
      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 16%, transparent)`, color: accentColor }}
        >
          {icon}
        </span>
        <span className="font-display font-bold">{label}</span>
      </div>
      {control}
    </motion.div>
  );
}

function SettingsPanelSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading settings" className="flex flex-col gap-3">
      <div
        className="relative mb-2 flex items-center gap-4 overflow-hidden rounded-3xl p-6 text-white shadow-lg"
        style={tileGradient(SETTINGS_COLOR)}
      >
        <Skeleton className="size-14 shrink-0 rounded-2xl bg-white/25" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32 rounded-full bg-white/25" />
          <Skeleton className="h-4 w-44 rounded-full bg-white/20" />
        </div>
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-[64px] w-full rounded-2xl" />
      ))}
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
  const hydrated = useStoreHydrated(useSettingsStore);

  if (!hydrated) return <SettingsPanelSkeleton />;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative mb-2 flex items-center gap-4 overflow-hidden rounded-3xl p-6 text-white shadow-lg"
        style={tileGradient(SETTINGS_COLOR)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/25 to-transparent"
        />
        <span aria-hidden="true" className="absolute -right-8 -top-10 size-32 rounded-full bg-white/15" />
        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <SettingsIcon className="size-7" aria-hidden="true" />
        </span>
        <div className="relative">
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="mt-0.5 text-sm text-white/85">Language, sound, and more</p>
        </div>
      </div>

      <SettingRow
        index={0}
        accentColor="#45AAF2"
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
        index={1}
        accentColor="#6C5CE7"
        icon={<Volume2 className="size-5" />}
        label="Voice"
        control={<Switch checked={voiceOn} onCheckedChange={toggleVoice} aria-label="Toggle voice" />}
      />
      <SettingRow
        index={2}
        accentColor="#FF69B4"
        icon={<Music className="size-5" />}
        label="Music"
        control={<Switch checked={musicOn} onCheckedChange={toggleMusic} aria-label="Toggle music" />}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <button type="button" className="w-full text-left">
            <SettingRow
              index={3}
              accentColor="#E74C3C"
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
