export interface QuizQuestion {
  readonly prompt: string;
  /**
   * When set, the prompt is a color-identification question and `prompt` is
   * generic text ("What color is this?") — the actual color to show is this
   * hex value, not encoded in `prompt` itself.
   */
  readonly promptColor?: string;
  /**
   * When set, the picture prompt is shown as this illustration instead of
   * `prompt`'s text glyph — used for items that don't have a real emoji
   * (see `LearningItem.image`).
   */
  readonly promptImage?: string;
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
