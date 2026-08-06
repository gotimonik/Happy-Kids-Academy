"use client";

import { Capacitor } from "@capacitor/core";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

interface StaticLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  readonly href: string;
  readonly children: ReactNode;
}

function toNativeStaticHref(href: string): string {
  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  const splitIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  const path = splitIndex === undefined ? href : href.slice(0, splitIndex);
  const suffix = splitIndex === undefined ? "" : href.slice(splitIndex);

  if (path === "" || path === "/") {
    return `/index.html${suffix}`;
  }

  const lastSegment = path.split("/").pop() ?? "";

  if (lastSegment.includes(".")) {
    return href;
  }

  return `${path}.html${suffix}`;
}

/** Strips the static-export `.html`/`index.html` suffix so paths compare like real routes. */
function normalizePathname(pathname: string): string {
  let path = pathname;
  if (path.endsWith("/index.html")) {
    path = path.slice(0, -"/index.html".length) || "/";
  } else if (path.endsWith(".html")) {
    path = path.slice(0, -".html".length);
  }
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path === "" ? "/" : path;
}

/**
 * True when `href` points at the page currently on screen (same path, query,
 * and hash). Every in-app navigation here is a hard `window.location`
 * navigation (see below), so clicking a link back to the current page — e.g.
 * tapping the already-active tab in the bottom/side nav — would otherwise
 * force a full reload for no reason: a visible flash and lost scroll/animation
 * state. Treating it as a no-op instead matches how native app tab bars behave.
 */
function isCurrentLocation(href: string): boolean {
  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    return false;
  }

  const target = new URL(href, window.location.href);
  return (
    normalizePathname(target.pathname) === normalizePathname(window.location.pathname) &&
    target.search === window.location.search &&
    target.hash === window.location.hash
  );
}

export function StaticLink({
  href,
  children,
  onClick,
  target,
  ...props
}: StaticLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || target === "_blank") {
      return;
    }

    if (isCurrentLocation(href)) {
      event.preventDefault();
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const nativeHref = toNativeStaticHref(href);

    if (nativeHref === href) {
      return;
    }

    event.preventDefault();
    window.location.href = nativeHref;
  }

  return (
    <a href={href} target={target} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
