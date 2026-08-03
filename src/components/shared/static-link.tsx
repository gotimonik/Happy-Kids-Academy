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

export function StaticLink({
  href,
  children,
  onClick,
  target,
  ...props
}: StaticLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      target === "_blank" ||
      !Capacitor.isNativePlatform()
    ) {
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
