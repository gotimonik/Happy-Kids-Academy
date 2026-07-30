/** Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle<T>(input: readonly T[]): T[] {
  const result = [...input];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}

/**
 * Picks `count` unique wrong-answer labels from `pool`, excluding `correctAnswer`
 * and de-duplicating. Guarantees `count` results whenever the pool is large enough,
 * unlike the original Android quiz which silently fell back to a literal "?" option.
 */
export function pickDistractors(
  pool: readonly string[],
  correctAnswer: string,
  count: number,
): string[] {
  const uniqueCandidates = Array.from(
    new Set(pool.filter((label) => label !== correctAnswer && label.trim().length > 0)),
  );
  return shuffle(uniqueCandidates).slice(0, count);
}

export function buildOptions(correctAnswer: string, distractors: readonly string[]): string[] {
  return shuffle([correctAnswer, ...distractors]);
}
