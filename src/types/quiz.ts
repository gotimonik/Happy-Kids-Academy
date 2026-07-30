export interface QuizQuestion {
  readonly prompt: string;
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
