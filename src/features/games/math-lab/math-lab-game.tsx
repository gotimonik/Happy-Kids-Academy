"use client";

import { RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdditionStory } from "./addition-story";
import { DivisionStory } from "./division-story";
import { MultiplicationStory } from "./multiplication-story";
import { SubtractionStory } from "./subtraction-story";
import { type MathOperation, useMathLab } from "./use-math-lab";

const OPERATIONS: { op: MathOperation; label: string; sign: string }[] = [
  { op: 0, label: "+ Add", sign: "+" },
  { op: 1, label: "− Take", sign: "−" },
  { op: 2, label: "× Groups", sign: "×" },
  { op: 3, label: "÷ Share", sign: "÷" },
];

export function MathLabGame() {
  const { op, a, b, step, running, message, totalSteps, setOperation, newExample, replay } = useMathLab();

  const result = op === 0 ? a + b : op === 1 ? a - b : op === 2 ? a * b : Math.floor(a / b);
  const showResult = !running && step >= totalSteps;
  const sign = OPERATIONS[op]?.sign ?? "+";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-2">
        {OPERATIONS.map((option) => (
          <button
            key={option.op}
            type="button"
            onClick={() => setOperation(option.op)}
            className={cn(
              "rounded-xl px-2 py-2.5 text-sm font-bold shadow-sm transition-colors",
              op === option.op ? "bg-success text-white" : "bg-card text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="text-center font-display text-3xl font-bold">
        {a} {sign} {b} = {showResult ? result : "?"}
      </p>
      <p className="text-center text-sm text-muted-foreground">{message}</p>

      <div className="min-h-56 rounded-3xl border border-border bg-card p-5 shadow-md">
        {op === 0 && <AdditionStory a={a} b={b} step={step} />}
        {op === 1 && <SubtractionStory a={a} b={b} step={step} />}
        {op === 2 && <MultiplicationStory a={a} b={b} step={step} />}
        {op === 3 && <DivisionStory a={a} b={b} step={step} />}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="kid" className="flex-1" onClick={replay}>
          <RotateCcw className="size-5" aria-hidden="true" />
          Replay
        </Button>
        <Button type="button" size="kid" className="flex-1 bg-success text-white hover:brightness-110" onClick={newExample}>
          <Shuffle className="size-5" aria-hidden="true" />
          New Example
        </Button>
      </div>
    </div>
  );
}
