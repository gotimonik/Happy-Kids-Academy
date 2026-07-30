"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChime } from "@/lib/audio/use-chime";
import { vibrate } from "@/lib/haptics/vibrate";
import { randomPraise } from "@/lib/quiz/praise";
import { useSpeechSynthesis } from "@/lib/speech/use-speech-synthesis";
import { useSettingsStore } from "@/store/settings-store";
import type { QuizQuestion, QuizResult, QuizStatus } from "@/types/quiz";

const TRY_AGAIN_MESSAGE = "Try again — you can do it!";
const CORRECT_DELAY_MS = 900;
const INCORRECT_DELAY_MS = 900;

export interface UseQuizEngineOptions {
  readonly generateQuestion: () => QuizQuestion;
  readonly totalRounds?: number;
  readonly onFinish?: (result: QuizResult) => void;
}

export interface UseQuizEngineResult {
  readonly question: QuizQuestion | null;
  readonly round: number;
  readonly totalRounds: number;
  readonly score: number;
  readonly status: QuizStatus;
  readonly feedbackMessage: string;
  readonly answer: (selected: string) => void;
  readonly restart: () => void;
}

function starsForScore(score: number, totalRounds: number): 1 | 2 | 3 {
  const ratio = totalRounds === 0 ? 0 : score / totalRounds;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

/**
 * Drives a full quiz session: question rotation, scoring, and spoken/haptic/audio
 * feedback. Shared by the per-category quiz, the Mixed Quiz, and every grade game
 * so none of them re-implement this logic (unlike the Android app, where each
 * screen had its own bespoke `draw*`/`answer()` pair).
 */
export function useQuizEngine({
  generateQuestion,
  totalRounds = 10,
  onFinish,
}: UseQuizEngineOptions): UseQuizEngineResult {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<QuizStatus>("answering");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const language = useSettingsStore((state) => state.language);
  const { speak } = useSpeechSynthesis();
  const { playWinChime } = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateQuestionRef = useRef(generateQuestion);
  useEffect(() => {
    generateQuestionRef.current = generateQuestion;
  }, [generateQuestion]);

  useEffect(() => {
    // The first question depends on `Math.random()`, so it is generated
    // post-mount rather than during the initial render.
    setQuestion(generateQuestionRef.current());
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const answer = useCallback(
    (selected: string) => {
      if (status !== "answering" || !question) return;

      if (selected === question.correctAnswer) {
        const nextScore = score + 1;
        const nextRound = round + 1;
        const praise = randomPraise(language);
        setScore(nextScore);
        setRound(nextRound);
        setStatus("correct");
        setFeedbackMessage(praise);
        vibrate(35);
        playWinChime();
        speak(praise);

        timeoutRef.current = setTimeout(() => {
          if (nextRound >= totalRounds) {
            setStatus("finished");
            onFinish?.({
              score: nextScore,
              totalRounds,
              starsEarned: starsForScore(nextScore, totalRounds),
              coinsEarned: nextScore * 2,
            });
          } else {
            setQuestion(generateQuestionRef.current());
            setStatus("answering");
          }
        }, CORRECT_DELAY_MS);
      } else {
        setStatus("incorrect");
        setFeedbackMessage(TRY_AGAIN_MESSAGE);
        vibrate(110);

        timeoutRef.current = setTimeout(() => {
          setStatus("answering");
        }, INCORRECT_DELAY_MS);
      }
    },
    [status, question, score, round, totalRounds, language, playWinChime, speak, onFinish],
  );

  const restart = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setScore(0);
    setRound(0);
    setStatus("answering");
    setFeedbackMessage("");
    setQuestion(generateQuestionRef.current());
  }, []);

  return { question, round, totalRounds, score, status, feedbackMessage, answer, restart };
}
