"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import type { QuizQuestion, QuizStatus } from "@/types/quiz";

const DURATION_SECONDS = 60;
const NEXT_QUESTION_DELAY_MS = 450;

export interface UseSpeedRoundOptions {
  readonly generateQuestion: () => QuizQuestion;
  readonly onFinish?: (finalScore: number) => void;
}

/**
 * A fast-paced timed quiz: answer as many questions as possible before the
 * clock runs out. Unlike the standard Quiz Engine, wrong answers don't force
 * a retry — the round keeps moving so the timer stays the star of the show.
 */
export function useSpeedRound({ generateQuestion, onFinish }: UseSpeedRoundOptions) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [status, setStatus] = useState<QuizStatus>("answering");

  const generateQuestionRef = useRef(generateQuestion);
  useEffect(() => {
    generateQuestionRef.current = generateQuestion;
  }, [generateQuestion]);

  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playWinChime } = useChime();

  useEffect(() => {
    // Randomized first question is generated post-mount, not during the initial render.
    setQuestion(generateQuestionRef.current());
  }, []);

  useEffect(() => {
    if (status === "finished") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (timeLeft === 0 && status !== "finished") {
      // The countdown reaching zero is an external-timer event, not a value
      // derivable during render, so the resulting state transition happens here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("finished");
      onFinish?.(score);
    }
  }, [timeLeft, status, score, onFinish]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const answer = useCallback(
    (selected: string) => {
      if (status !== "answering" || !question) return;
      const isCorrect = selected === question.correctAnswer;

      setAnswered((n) => n + 1);
      setStatus(isCorrect ? "correct" : "incorrect");

      if (isCorrect) {
        setScore((s) => s + 1);
        vibrate(25);
        playWinChime();
      } else {
        vibrate(90);
      }

      advanceTimeoutRef.current = setTimeout(() => {
        setStatus((current) => (current === "finished" ? current : "answering"));
        setQuestion(generateQuestionRef.current());
      }, NEXT_QUESTION_DELAY_MS);
    },
    [status, question, playWinChime],
  );

  const restart = useCallback(() => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setScore(0);
    setAnswered(0);
    setTimeLeft(DURATION_SECONDS);
    setStatus("answering");
    setQuestion(generateQuestionRef.current());
  }, []);

  return {
    question,
    score,
    answered,
    timeLeft,
    durationSeconds: DURATION_SECONDS,
    status,
    answer,
    restart,
  };
}
