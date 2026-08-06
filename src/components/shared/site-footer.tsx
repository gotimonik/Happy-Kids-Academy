import { Heart } from "lucide-react";
import { StaticLink as Link } from "./static-link";

const FOOTER_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-10 border-t border-border bg-muted/40">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6C5CE7] via-[#00B894] to-[#FDCB6E]"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center md:px-8">
        <p className="flex items-center gap-1.5 font-display text-sm font-bold text-foreground">
          Made with <Heart className="size-4 fill-current text-[#E17055]" aria-hidden="true" /> for curious minds
        </p>
        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Happy Kids Academy. Works fully offline — no ads, no accounts, no data leaves this device.
        </p>
      </div>
    </footer>
  );
}
