"use client";

import { useEffect, useState } from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
}

interface StoreWithPersist {
  persist: PersistApi;
}

/**
 * Tracks whether a `persist`-wrapped zustand store has finished reading its
 * saved state from localStorage.
 *
 * This app is a fully static export (no server at request time), so every
 * persisted store (progress, settings, study coach) starts out holding only
 * its default values — localStorage doesn't exist until the client mounts.
 * Without this guard, pages that read stats straight from these stores (e.g.
 * Rewards, Parent Progress) would render "0 stars / Level 1 / 0 coins" for a
 * moment and then visibly jump to the real numbers once hydration finishes.
 *
 * Always starts `false` and flips to `true` inside an effect — never from
 * the initializer — so the client's first render matches the statically
 * pre-rendered HTML exactly (same guard shape as the `mounted` pattern in
 * `theme-toggle.tsx`, needed for the same reason: no data to hydrate with
 * exists at static-export build time).
 */
export function useStoreHydrated(store: StoreWithPersist): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (store.persist.hasHydrated()) {
      // Some other component using this store already triggered hydration
      // before this one mounted — still happening post-mount, so no
      // SSR/client mismatch risk, just no separate "finish" event to wait for.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrated(true);
      return;
    }

    return store.persist.onFinishHydration(() => setHydrated(true));
  }, [store]);

  return hydrated;
}
