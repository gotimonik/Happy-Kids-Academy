import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function SpecialTile({
  href,
  title,
  subtitle,
  icon: Icon,
  color,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-md transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:min-h-36"
      style={{ backgroundColor: color }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-4 -top-6 size-20 rounded-full bg-white/15 transition-transform group-hover:scale-110"
      />
      <Icon className="relative size-7" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-base font-bold leading-tight sm:text-lg">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/85">{subtitle}</p>
      </div>
    </Link>
  );
}
