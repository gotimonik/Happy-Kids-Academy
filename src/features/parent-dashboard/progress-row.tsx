import type { ReactNode } from "react";

export function ProgressRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <span aria-hidden="true" className="text-xl">
        {icon}
      </span>
      <div>
        <p className="font-display font-bold">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
