export type AppLanguage = "en" | "gu" | "hi";

/** "single" shows just the capital letter (A); "double" pairs it with lowercase (Aa). */
export type AlphabetCase = "single" | "double";

/** Which digit glyphs the Numbers category renders — content/labels are unchanged either way. */
export type NumberScript = "english" | "gujarati";

export interface SettingsState {
  readonly language: AppLanguage;
  readonly voiceOn: boolean;
  readonly musicOn: boolean;
  readonly alphabetCase: AlphabetCase;
  readonly numberScript: NumberScript;
}

export const INITIAL_SETTINGS: SettingsState = {
  language: "en",
  voiceOn: true,
  musicOn: true,
  alphabetCase: "single",
  numberScript: "english",
};

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "English",
  gu: "ગુજરાતી",
  hi: "हिंदी",
};

export const LANGUAGE_LOCALES: Record<AppLanguage, string> = {
  en: "en-US",
  gu: "gu-IN",
  hi: "hi-IN",
};
