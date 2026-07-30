import type { GuideEntry } from "@/lib/study-coach/guide-content";

export function GuideList({ entries, accentColor }: { entries: readonly GuideEntry[]; accentColor: string }) {
  return (
    <ol className="flex flex-col gap-3">
      {entries.map((entry, index) => (
        <li
          key={`${entry.title}-${index}`}
          className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </span>
          <div>
            <p className="font-display font-bold">{entry.title}</p>
            <p className="text-sm text-muted-foreground">{entry.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
