import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: Route;
}

/**
 * Visible breadcrumb trail. Pair with `breadcrumbJsonLd()` from `@/lib/seo/json-ld`
 * on the page for the matching structured data.
 */
export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
              {item.href && !isLast ? (
                <Link href={item.href} className="font-semibold hover:text-foreground hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="font-semibold text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
