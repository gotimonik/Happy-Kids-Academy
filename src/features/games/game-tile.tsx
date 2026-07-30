import Link from "next/link";
import type { GameDefinition } from "@/types/game";

export function GameTile({ game }: { game: GameDefinition }) {
  return (
    <Link
      href={game.href}
      className="group relative flex min-h-28 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
      style={{ backgroundColor: game.color }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-4 -top-6 size-20 rounded-full bg-white/15 transition-transform group-hover:scale-110"
      />
      <span aria-hidden="true" className="relative text-2xl">
        {game.icon}
      </span>
      <div className="relative">
        <p className="font-display text-base font-bold leading-tight">{game.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/85">{game.description}</p>
      </div>
    </Link>
  );
}
