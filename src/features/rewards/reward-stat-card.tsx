import type { ReactNode } from "react";
import { tileGradient } from "@/lib/ui/tile-gradient";

export function RewardStatCard({
  icon,
  label,
  value,
  accentColor,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
}) {
  return (
    <div
      className="relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl p-5 text-center text-white shadow-md"
      style={tileGradient(accentColor)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent"
      />
      <span aria-hidden="true" className="absolute -right-5 -top-6 size-20 rounded-full bg-white/15" />

      <span
        aria-hidden="true"
        className="relative flex size-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
      >
        {icon}
      </span>
      <span className="relative font-display text-2xl font-bold drop-shadow-sm">{value}</span>
      <span className="relative text-xs font-semibold text-white/85">{label}</span>
    </div>
  );
}
