import type { LucideIcon } from "lucide-react";
import { StaticLink as Link } from "@/components/shared/static-link";
import { tileGradient } from "@/lib/ui/tile-gradient";

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
      className="group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:min-h-36"
      style={tileGradient(color)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute -right-5 -top-7 size-24 rounded-full bg-white/15 transition-transform group-hover:scale-110"
      />
      <span aria-hidden="true" className="absolute -left-6 -bottom-8 size-24 rounded-full bg-black/10 blur-md" />
      <Icon className="relative size-12 drop-shadow-sm" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-lg font-bold leading-tight drop-shadow-sm sm:text-xl">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/85">{subtitle}</p>
      </div>
    </Link>
  );
}
