"use client";

let cachedVoices: SpeechSynthesisVoice[] = [];
let loadPromise: Promise<SpeechSynthesisVoice[]> | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForVoices(
  maxAttempts = 20,
  interval = 250
): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  for (let i = 0; i < maxAttempts; i++) {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      cachedVoices = voices;
      return voices;
    }

    await sleep(interval);
  }

  return [];
}

export async function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  if (cachedVoices.length > 0) {
    return cachedVoices;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = waitForVoices();

  const voices = await loadPromise;

  cachedVoices = voices;
  loadPromise = null;

  return voices;
}

export function primeVoiceCatalog(): void {
  void loadVoices();
}

export async function pickBestVoice(
  locale: string
): Promise<SpeechSynthesisVoice | undefined> {
  const voices =
    cachedVoices.length > 0 ? cachedVoices : await loadVoices();

  if (voices.length === 0) {
    return undefined;
  }

  const normalize = (lang: string) =>
    lang.toLowerCase().replace(/_/g, "-");

  const target = normalize(locale);
  const primary = target.split("-")[0];

  const exact = voices.filter(
    (v) => normalize(v.lang) === target
  );

  const partial = voices.filter((v) => {
    const lang = normalize(v.lang);
    return lang === primary || lang.startsWith(primary + "-");
  });

  const candidates = exact.length ? exact : partial;

  if (!candidates.length) {
    return undefined;
  }

  const qualityPattern =
    /google|natural|neural|enhanced|premium/i;

  return (
    candidates.find((v) => qualityPattern.test(v.name)) ??
    candidates.find((v) => v.default) ??
    candidates[0]
  );
}

export async function speak(
  text: string,
  locale = "en-US"
): Promise<void> {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window)
  ) {
    return;
  }

  const synth = window.speechSynthesis;

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = locale;

  const voice = await pickBestVoice(locale);

  if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  synth.speak(utterance);
}