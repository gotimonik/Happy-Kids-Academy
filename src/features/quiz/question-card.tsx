export function QuestionCard({ prompt }: { prompt: string }) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-md">
      <p className="font-display text-3xl font-bold sm:text-4xl">{prompt}</p>
    </div>
  );
}
