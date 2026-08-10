import type { AppLanguage } from "@/types/settings";

/**
 * UI-chrome translations only — nav, settings, buttons, headers, quiz
 * results, and similar interface text. Learning *content* (category names,
 * item labels like "Apple"/"Lion", quiz prompts/options) intentionally stays
 * in English regardless of this setting: the app teaches English vocabulary,
 * and `language` here only used to pick the pronunciation voice/locale
 * before this — see `LANGUAGE_LOCALES` in `types/settings.ts`.
 *
 * `{placeholder}` tokens are filled in by `useTranslation()`'s `t(key, vars)`.
 */
const en = {
  "common.playAgain": "Play Again",
  "common.backToHome": "Back to Home",
  "common.tryAgain": "Try again",
  "common.cancel": "Cancel",

  "nav.home": "Home",
  "nav.games": "Games",
  "nav.rewards": "Rewards",
  "nav.coach": "Coach",
  "nav.settings": "Settings",
  "nav.menu": "Menu",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",

  "settings.title": "Settings",
  "settings.subtitle": "Language, sound, and more",
  "settings.language": "Language",
  "settings.voice": "Voice",
  "settings.music": "Music",
  "settings.resetProgress": "Reset Progress",
  "settings.tapToReset": "Tap to reset",
  "settings.resetConfirmTitle": "Reset all progress?",
  "settings.resetConfirmDescription":
    "This clears stars, coins, badges, and lesson history. Language and sound settings are kept. This cannot be undone.",
  "settings.resetConfirmButton": "Reset progress",
  "settings.offlineNote": "This app works fully offline once loaded.",

  "home.tagline": "Learn • Play • Grow ✨",
  "home.explorePlay": "Explore & play",
  "home.tile.quizTitle": "Quiz",
  "home.tile.quizSubtitle": "Mixed questions",
  "home.tile.gamesTitle": "Games",
  "home.tile.gamesSubtitle": "Learning mini games",
  "home.tile.rewardsTitle": "Rewards",
  "home.tile.rewardsSubtitle": "Stars • coins • badges",
  "home.tile.parentsTitle": "Parent Progress",
  "home.tile.parentsSubtitle": "Learning report",
  "home.tile.coachTitle": "Study Coach",
  "home.tile.coachSubtitle": "Rules • hunt • routine",
  "home.tile.settingsTitle": "Settings",
  "home.tile.settingsSubtitle": "Language • sound",

  "learn.tile.learnTitle": "Learn",
  "learn.tile.learnSubtitle": "Explore {count} cards",
  "learn.tile.quizTitle": "Play Quiz",
  "learn.tile.quizSubtitle": "10 fun questions",
  "learn.tile.practiceTitle": "Writing Practice",
  "learn.tile.practiceSubtitle": "Trace and draw",
  "learn.back": "Back",
  "learn.next": "Next",
  "learn.finish": "Finish",
  "learn.pronounce": "Pronounce",

  "quiz.questionOf": "Question {current} / {total}",
  "quiz.amazing": "Amazing!",
  "quiz.wellDone": "Well done!",
  "quiz.scoreLine": "You scored {score} out of {total}",
  "quiz.coinsEarned": "+{count} coins",

  "footer.taglineBefore": "Made with",
  "footer.taglineAfter": "for curious minds",
  "footer.privacyPolicy": "Privacy Policy",
  "footer.termsOfUse": "Terms of Use",
  "footer.disclaimer": "Disclaimer",
  "footer.accessibility": "Accessibility",
  "footer.copyright":
    "© {year} Happy Kids Academy. Works fully offline — no ads, no accounts, no data leaves this device.",

  "error.title": "Something went wrong",
  "error.description": "Please try again in a moment.",
} as const;

export type TranslationKey = keyof typeof en;

const gu: Record<TranslationKey, string> = {
  "common.playAgain": "ફરી રમો",
  "common.backToHome": "ઘરે પાછા જાઓ",
  "common.tryAgain": "ફરી પ્રયાસ કરો",
  "common.cancel": "રદ કરો",

  "nav.home": "ઘર",
  "nav.games": "રમતો",
  "nav.rewards": "ઈનામો",
  "nav.coach": "કોચ",
  "nav.settings": "સેટિંગ્સ",
  "nav.menu": "મેનુ",
  "nav.openMenu": "મેનુ ખોલો",
  "nav.closeMenu": "મેનુ બંધ કરો",

  "settings.title": "સેટિંગ્સ",
  "settings.subtitle": "ભાષા, અવાજ અને વધુ",
  "settings.language": "ભાષા",
  "settings.voice": "અવાજ",
  "settings.music": "સંગીત",
  "settings.resetProgress": "પ્રગતિ રીસેટ કરો",
  "settings.tapToReset": "રીસેટ કરવા માટે ટેપ કરો",
  "settings.resetConfirmTitle": "શું બધી પ્રગતિ રીસેટ કરવી છે?",
  "settings.resetConfirmDescription":
    "આ સ્ટાર્સ, કોઈન્સ, બેજ અને પાઠનો ઇતિહાસ સાફ કરે છે. ભાષા અને સાઉન્ડ સેટિંગ્સ રહેશે. આ પરત કરી શકાશે નહીં.",
  "settings.resetConfirmButton": "પ્રગતિ રીસેટ કરો",
  "settings.offlineNote": "આ એપ લોડ થયા પછી સંપૂર્ણપણે ઓફલાઇન કામ કરે છે.",

  "home.tagline": "શીખો • રમો • વિકસો ✨",
  "home.explorePlay": "શોધો અને રમો",
  "home.tile.quizTitle": "ક્વિઝ",
  "home.tile.quizSubtitle": "મિક્સ પ્રશ્નો",
  "home.tile.gamesTitle": "રમતો",
  "home.tile.gamesSubtitle": "શીખવાની મિની ગેમ્સ",
  "home.tile.rewardsTitle": "ઈનામો",
  "home.tile.rewardsSubtitle": "સ્ટાર્સ • કોઈન્સ • બેજ",
  "home.tile.parentsTitle": "પેરેન્ટ પ્રગતિ",
  "home.tile.parentsSubtitle": "શિક્ષણ રિપોર્ટ",
  "home.tile.coachTitle": "સ્ટડી કોચ",
  "home.tile.coachSubtitle": "નિયમો • શોધ • રૂટિન",
  "home.tile.settingsTitle": "સેટિંગ્સ",
  "home.tile.settingsSubtitle": "ભાષા • સાઉન્ડ",

  "learn.tile.learnTitle": "શીખો",
  "learn.tile.learnSubtitle": "{count} કાર્ડ્સ જુઓ",
  "learn.tile.quizTitle": "ક્વિઝ રમો",
  "learn.tile.quizSubtitle": "10 મજેદાર પ્રશ્નો",
  "learn.tile.practiceTitle": "લેખન અભ્યાસ",
  "learn.tile.practiceSubtitle": "ટ્રેસ કરો અને દોરો",
  "learn.back": "પાછળ",
  "learn.next": "આગળ",
  "learn.finish": "પૂર્ણ",
  "learn.pronounce": "ઉચ્ચાર કરો",

  "quiz.questionOf": "પ્રશ્ન {current} / {total}",
  "quiz.amazing": "અદ્ભુત!",
  "quiz.wellDone": "સરસ કામ!",
  "quiz.scoreLine": "તમે {total} માંથી {score} મેળવ્યા",
  "quiz.coinsEarned": "+{count} કોઈન્સ",

  "footer.taglineBefore": "બનાવ્યું",
  "footer.taglineAfter": "ઉત્સુક મનો માટે",
  "footer.privacyPolicy": "ગોપનીયતા નીતિ",
  "footer.termsOfUse": "ઉપયોગની શરતો",
  "footer.disclaimer": "અસ્વીકરણ",
  "footer.accessibility": "એક્સેસિબિલિટી",
  "footer.copyright":
    "© {year} Happy Kids Academy. સંપૂર્ણપણે ઓફલાઇન કામ કરે છે — કોઈ જાહેરાત નહીં, કોઈ એકાઉન્ટ નહીં, કોઈ ડેટા આ ડિવાઇસમાંથી બહાર જતો નથી.",

  "error.title": "કંઈક ખોટું થયું",
  "error.description": "મહેરબાની કરીને થોડી વારમાં ફરી પ્રયાસ કરો.",
};

const hi: Record<TranslationKey, string> = {
  "common.playAgain": "फिर से खेलें",
  "common.backToHome": "होम पर वापस जाएं",
  "common.tryAgain": "फिर कोशिश करें",
  "common.cancel": "रद्द करें",

  "nav.home": "होम",
  "nav.games": "खेल",
  "nav.rewards": "पुरस्कार",
  "nav.coach": "कोच",
  "nav.settings": "सेटिंग्स",
  "nav.menu": "मेनू",
  "nav.openMenu": "मेनू खोलें",
  "nav.closeMenu": "मेनू बंद करें",

  "settings.title": "सेटिंग्स",
  "settings.subtitle": "भाषा, आवाज़ और अधिक",
  "settings.language": "भाषा",
  "settings.voice": "आवाज़",
  "settings.music": "संगीत",
  "settings.resetProgress": "प्रगति रीसेट करें",
  "settings.tapToReset": "रीसेट करने के लिए टैप करें",
  "settings.resetConfirmTitle": "क्या सारी प्रगति रीसेट करें?",
  "settings.resetConfirmDescription":
    "यह स्टार्स, कॉइन्स, बैज और पाठ इतिहास को मिटा देता है। भाषा और साउंड सेटिंग्स बनी रहेंगी। इसे पूर्ववत नहीं किया जा सकता।",
  "settings.resetConfirmButton": "प्रगति रीसेट करें",
  "settings.offlineNote": "यह ऐप लोड होने के बाद पूरी तरह ऑफ़लाइन काम करता है।",

  "home.tagline": "सीखें • खेलें • बढ़ें ✨",
  "home.explorePlay": "खोजें और खेलें",
  "home.tile.quizTitle": "क्विज़",
  "home.tile.quizSubtitle": "मिश्रित प्रश्न",
  "home.tile.gamesTitle": "खेल",
  "home.tile.gamesSubtitle": "सीखने वाले मिनी गेम्स",
  "home.tile.rewardsTitle": "पुरस्कार",
  "home.tile.rewardsSubtitle": "स्टार्स • कॉइन्स • बैज",
  "home.tile.parentsTitle": "पेरेंट प्रगति",
  "home.tile.parentsSubtitle": "लर्निंग रिपोर्ट",
  "home.tile.coachTitle": "स्टडी कोच",
  "home.tile.coachSubtitle": "नियम • खोज • रूटीन",
  "home.tile.settingsTitle": "सेटिंग्स",
  "home.tile.settingsSubtitle": "भाषा • साउंड",

  "learn.tile.learnTitle": "सीखें",
  "learn.tile.learnSubtitle": "{count} कार्ड देखें",
  "learn.tile.quizTitle": "क्विज़ खेलें",
  "learn.tile.quizSubtitle": "10 मज़ेदार सवाल",
  "learn.tile.practiceTitle": "लेखन अभ्यास",
  "learn.tile.practiceSubtitle": "ट्रेस करें और बनाएं",
  "learn.back": "पीछे",
  "learn.next": "आगे",
  "learn.finish": "समाप्त",
  "learn.pronounce": "उच्चारण करें",

  "quiz.questionOf": "सवाल {current} / {total}",
  "quiz.amazing": "कमाल!",
  "quiz.wellDone": "बहुत बढ़िया!",
  "quiz.scoreLine": "आपने {total} में से {score} अंक पाए",
  "quiz.coinsEarned": "+{count} कॉइन्स",

  "footer.taglineBefore": "बनाया गया",
  "footer.taglineAfter": "जिज्ञासु मनों के लिए",
  "footer.privacyPolicy": "गोपनीयता नीति",
  "footer.termsOfUse": "उपयोग की शर्तें",
  "footer.disclaimer": "अस्वीकरण",
  "footer.accessibility": "सुगमता",
  "footer.copyright":
    "© {year} Happy Kids Academy. पूरी तरह ऑफ़लाइन काम करता है — कोई विज्ञापन नहीं, कोई खाता नहीं, कोई डेटा इस डिवाइस से बाहर नहीं जाता।",

  "error.title": "कुछ गड़बड़ हो गई",
  "error.description": "कृपया थोड़ी देर में फिर कोशिश करें।",
};

export const TRANSLATIONS: Record<AppLanguage, Record<TranslationKey, string>> = { en, gu, hi };
