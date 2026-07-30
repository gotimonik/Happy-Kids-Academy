import type { AppLanguage } from "@/types/settings";

const PRAISE: Record<AppLanguage, readonly string[]> = {
  en: ["Very good!", "Excellent!", "Well done!", "Amazing!", "Fantastic!"],
  gu: ["ખૂબ સરસ!", "શાબાશ!", "બહુ સારું!"],
  hi: ["बहुत अच्छा!", "शाबाश!", "शानदार!"],
};

export function randomPraise(language: AppLanguage): string {
  const options = PRAISE[language];
  const choice = options[Math.floor(Math.random() * options.length)];
  return choice ?? "Well done!";
}
