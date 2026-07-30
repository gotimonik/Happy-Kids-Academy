"use client";

let cachedVoices: SpeechSynthesisVoice[] = [];
let loadPromise: Promise<SpeechSynthesisVoice[]> | null = null;

/**
 * Resolves once the browser has reported its installed speech-synthesis voices.
 * Chrome/Edge load voices asynchronously, so the first call to `getVoices()`
 * often returns an empty array — this waits for the `voiceschanged` event
 * (with a timeout fallback) so voice selection has something to work with.
 */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) {
    cachedVoices = existing;
    return Promise.resolve(existing);
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        cachedVoices = voices;
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        resolve(voices);
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    // Safety net for browsers that never fire `voiceschanged`.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });

  return loadPromise;
}

/** Fires the async voice load early (e.g. on app mount) so it's warm by the first `speak()` call. */
export function primeVoiceCatalog(): void {
  void loadVoices();
}

/**
 * Picks the clearest available voice for a BCP-47 locale. Prefers voices whose
 * name suggests a higher-quality neural/natural engine (Chrome's "Google" voices,
 * Edge's "Natural" voices, Safari's "Enhanced"/"Premium" voices) over default
 * robotic system voices, and falls back gracefully when none match.
 */
export function pickBestVoice(locale: string): SpeechSynthesisVoice | undefined {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoicesSync();
  if (voices.length === 0) return undefined;

  const normalize = (lang: string) => lang.toLowerCase().replace(/_/g, "-");
  const targetLang = normalize(locale);
  const targetPrimary = targetLang.split("-")[0];

  const exactMatches = voices.filter((v) => normalize(v.lang) === targetLang);
  const primaryMatches = voices.filter((v) => {
    const voiceLang = normalize(v.lang);
    return voiceLang.startsWith(`${targetPrimary}-`) || voiceLang === targetPrimary;
  });
  const candidates = exactMatches.length > 0 ? exactMatches : primaryMatches;

  if (candidates.length === 0) return undefined;

  const qualityPattern = /google|natural|neural|enhanced|premium/i;
  const highQuality = candidates.find((v) => qualityPattern.test(v.name));
  return highQuality ?? candidates[0];
}

function loadVoicesSync(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) cachedVoices = voices;
  return voices;
}
