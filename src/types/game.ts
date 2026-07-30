export type GameId =
  | "balloon-pop"
  | "matching"
  | "math-lab"
  | "missing-number"
  | "odd-or-even"
  | "times-tables"
  | "word-builder"
  | "patterns"
  | "memory"
  | "puzzle"
  | "drag-and-drop"
  | "find-correct-answer"
  | "coloring"
  | "drawing"
  | "tracing-letters"
  | "tracing-numbers"
  | "speed-round"
  | "simon-pattern"
  | "sound-safari";

export interface GameDefinition {
  readonly id: GameId;
  readonly title: string;
  readonly icon: string;
  readonly color: string;
  readonly description: string;
  readonly href: string;
}
