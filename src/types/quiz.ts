export interface QuizQuestion {
  readonly prompt: string;
  /**
   * When set, the prompt is a color-identification question and `prompt` is
   * generic text ("What color is this?") — the actual color to show is this
   * hex value, not encoded in `prompt` itself.
   */
  readonly promptColor?: string;
  readonly correctAnswer: string;
  readonly options: readonly string[];
}

export type QuizStatus = "answering" | "correct" | "incorrect" | "finished";

export interface QuizResult {
  readonly score: number;
  readonly totalRounds: number;
  readonly starsEarned: 1 | 2 | 3;
  readonly coinsEarned: number;
}
