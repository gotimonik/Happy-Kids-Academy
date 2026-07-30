export type AppLanguage = "en" | "gu" | "hi";

export interface SettingsState {
  readonly language: AppLanguage;
  readonly voiceOn: boolean;
  readonly musicOn: boolean;
}

export const INITIAL_SETTINGS: SettingsState = {
  language: "en",
  voiceOn: true,
  musicOn: true,
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
