/**
 * Converts a 0–1 accuracy ratio into a 0–3 star rating. Shared by the quiz
 * engine (`recordQuizResult`) and writing-practice trace scoring
 * (`recordAttempt`) so "stars" mean the same thing everywhere in the app,
 * regardless of which activity earned them.
 *
 * Any genuine attempt earns at least 1 star — this app rewards trying, not
 * just perfection (matches the original quiz-only behavior this was
 * extracted from).
 */
export function starsForRatio(ratio: number): number {
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}
