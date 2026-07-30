export function NumberBall({ number, color }: { number: number; color: string }) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md sm:size-10"
      style={{ backgroundColor: color }}
    >
      {number}
    </span>
  );
}
