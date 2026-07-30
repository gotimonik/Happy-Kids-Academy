import { NumberBall } from "./number-ball";

const BOX_COLORS = ["#45AAF2", "#FF707D", "#37C183", "#A45EEA"];

export function DivisionStory({ a, b, step }: { a: number; b: number; step: number }) {
  const placed = Math.min(step, a);
  const perBox = Math.floor(a / b);
  const boxes = Array.from({ length: b }, () => [] as number[]);
  for (let i = 0; i < placed; i += 1) {
    boxes[i % b]?.push(i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-full gap-3" style={{ gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))` }}>
        {boxes.map((ballNumbers, box) => (
          <div key={box} className="flex flex-col items-center gap-2 rounded-2xl bg-sky-50 p-3 dark:bg-slate-800">
            <span className="text-xs font-bold text-muted-foreground">Box {box + 1}</span>
            <div className="flex flex-col items-center gap-1.5">
              {ballNumbers.map((n) => (
                <NumberBall key={n} number={n} color={BOX_COLORS[box % BOX_COLORS.length] ?? "#45AAF2"} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm font-bold text-primary">
        {placed === a ? `Each box has ${perBox} balls` : `${placed} of ${a} balls shared`}
      </p>
    </div>
  );
}
