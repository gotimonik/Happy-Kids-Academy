"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChime } from "@/lib/audio/use-chime";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";

export type MathOperation = 0 | 1 | 2 | 3; // addition, subtraction, multiplication, division

function randomExample(op: MathOperation): { a: number; b: number } {
  if (op === 0) return { a: 1 + Math.floor(Math.random() * 5), b: 1 + Math.floor(Math.random() * 5) };
  if (op === 1) {
    const a = 4 + Math.floor(Math.random() * 7);
    return { a, b: 1 + Math.floor(Math.random() * (a - 1)) };
  }
  if (op === 2) return { a: 2 + Math.floor(Math.random() * 3), b: 2 + Math.floor(Math.random() * 3) };
  const b = 2 + Math.floor(Math.random() * 3);
  const quotient = 1 + Math.floor(Math.random() * 3);
  return { a: b * quotient, b };
}

function maxSteps(op: MathOperation, a: number, b: number): number {
  if (op === 0) return a + b;
  if (op === 1) return b;
  if (op === 2) return a;
  return a;
}

function messageForStep(op: MathOperation, a: number, b: number, step: number): string {
  if (op === 0) return `Ball ${step} goes in. Now the box has ${step}.`;
  if (op === 1) return `Take away one ball. ${a - step} balls are left.`;
  if (op === 2) return `Group ${step} is ready. We have ${step * b} balls.`;
  return `Share ball ${step} into box ${((step - 1) % b) + 1}.`;
}

function introMessage(op: MathOperation, a: number, b: number): string {
  if (op === 0) return `First put ${a} balls in the box, then add ${b} more.`;
  if (op === 1) return `Start with ${a} balls and take away ${b}.`;
  if (op === 2) return `Make ${a} groups with ${b} balls in every group.`;
  return `Share ${a} balls equally between ${b} boxes.`;
}

function finalMessage(op: MathOperation, a: number, b: number): string {
  if (op === 0) return `Count all the balls: ${Array.from({ length: a + b }, (_, i) => i + 1).join(", ")}. Total balls in the box is ${a + b}.`;
  if (op === 1) return `${a} take away ${b} leaves ${a - b} balls.`;
  if (op === 2) return `${a} groups of ${b} make ${a * b} balls altogether.`;
  return `${a} shared into ${b} equal boxes gives ${Math.floor(a / b)} balls in each box.`;
}

export function useMathLab() {
  const [op, setOp] = useState<MathOperation>(0);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("Two balls, then three more balls.");

  const generationRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { speak } = useSpeechSynthesis();
  const { playWinChime } = useChime();

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const runDemo = useCallback(
    (currentOp: MathOperation, currentA: number, currentB: number) => {
      const generation = ++generationRef.current;
      setStep(0);
      setRunning(true);
      const intro = introMessage(currentOp, currentA, currentB);
      setMessage(intro);
      speak(intro);

      const total = maxSteps(currentOp, currentA, currentB);

      function advance(current: number) {
        if (generation !== generationRef.current) return;
        const next = current + 1;
        setStep(next);
        const stepMessage = messageForStep(currentOp, currentA, currentB, next);
        setMessage(stepMessage);
        speak(next === 1 ? `Count ${next}` : `${next}`);

        if (next < total) {
          timeoutRef.current = setTimeout(() => advance(next), 760);
        } else {
          timeoutRef.current = setTimeout(() => {
            if (generation !== generationRef.current) return;
            setRunning(false);
            const final = finalMessage(currentOp, currentA, currentB);
            setMessage(final);
            speak(final);
            playWinChime();
          }, 850);
        }
      }

      timeoutRef.current = setTimeout(() => advance(0), 1100);
    },
    [speak, playWinChime],
  );

  const newExample = useCallback(
    (nextOp: MathOperation = op) => {
      clearTimer();
      const example = randomExample(nextOp);
      setOp(nextOp);
      setA(example.a);
      setB(example.b);
      runDemo(nextOp, example.a, example.b);
    },
    [op, clearTimer, runDemo],
  );

  const replay = useCallback(() => {
    clearTimer();
    runDemo(op, a, b);
  }, [op, a, b, clearTimer, runDemo]);

  useEffect(() => {
    // First example is randomized post-mount, not during the initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    newExample(0);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return {
    op,
    a,
    b,
    step,
    running,
    message,
    totalSteps: maxSteps(op, a, b),
    setOperation: newExample,
    newExample: () => newExample(op),
    replay,
  };
}
