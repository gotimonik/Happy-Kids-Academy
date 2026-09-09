/**
 * Deterministic PRNG (mulberry32) seeded from an arbitrary string, so the
 * same seed always produces the exact same sequence of numbers. Used by the
 * Daily Challenge to pick "today's" questions: every player who opens it on
 * the same calendar day sees the same set, with no server needed — the
 * date key itself *is* the seed.
 */
function hashSeed(seed: string): number {
  let hash = 1779033703 ^ seed.length;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle driven by a PRNG seeded from `seed` — same seed, same output order, every time. Returns a new array; does not mutate `input`. */
export function seededShuffle<T>(input: readonly T[], seed: string): T[] {
  const random = mulberry32(hashSeed(seed));
  const result = [...input];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}
