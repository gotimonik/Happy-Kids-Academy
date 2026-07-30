import { NumberBall } from "./number-ball";

const GROUP_COLORS = ["#45AAF2", "#FF707D", "#A45EEA", "#FF9F43", "#37C183"];

export function MultiplicationStory({ a, b, step }: { a: number; b: number; step: number }) {
  const groupsReady = Math.min(step, a);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-full grid-cols-2 gap-3">
        {Array.from({ length: a }, (_, g) => (
          <div
            key={g}
            className={
              g < groupsReady
                ? "flex flex-col items-center gap-2 rounded-2xl bg-success/10 p-3"
                : "flex flex-col items-center gap-2 rounded-2xl bg-muted p-3"
            }
          >
            <span className="text-xs font-bold text-muted-foreground">Group {g + 1}</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {g < groupsReady &&
                Array.from({ length: b }, (_, i) => (
                  <NumberBall key={i} number={g * b + i + 1} color={GROUP_COLORS[g % GROUP_COLORS.length] ?? "#45AAF2"} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm font-bold text-primary">
        {groupsReady} groups = {groupsReady * b} balls
      </p>
    </div>
  );
}
