import type { ReactNode } from "react";

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
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
      <span aria-hidden="true" className="text-2xl" style={{ color: accentColor }}>
        {icon}
      </span>
      <span className="font-display text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
