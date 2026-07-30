export type CoachGrade = 1 | 2 | 3;

export const COACH_GAMES = ["Alphabet Fishing Pond", "Balloon Pop", "Matching Game", "Number Hunt"] as const;

export interface GuideEntry {
  readonly title: string;
  readonly body: string;
}

/** "Customize Game" guide: 3 difficulty rounds plus a household-materials list. */
export function gameVariationEntries(grade: CoachGrade, gameIndex: number): GuideEntry[] {
  const game = COACH_GAMES[gameIndex] ?? COACH_GAMES[0];
  const challenge =
    grade === 1
      ? "Use letters, sounds, and pictures. Allow plenty of thinking time."
      : grade === 2
        ? "Add short words, spelling clues, and a gentle 30-second challenge."
        : "Use sentences, multiplication clues, and points for explaining each answer.";
  const materials =
    gameIndex === 0
      ? "Paper fish, marker, bowl, string, pencil, paper clips, and a fridge magnet."
      : gameIndex === 1
        ? "Paper, colored pencils, scissors, tape, and a laundry basket."
        : gameIndex === 2
          ? "Paper cards, marker, crayons, ruler, and bottle caps."
          : "Number cards, sticky notes, pencil, small box, and 10 buttons or beans.";

  return [
    { title: `${game} — Easy Round`, body: `Show 5 choices. The child says the name before choosing. ${challenge}` },
    { title: `${game} — Clue Round`, body: "Give a sound, picture, or simple riddle instead of showing the answer." },
    {
      title: `${game} — Challenge Round`,
      body: "Earn one star for the answer and another star for explaining why it is correct.",
    },
    { title: "Materials from home", body: materials },
  ];
}

/** A 10-question multilingual treasure hunt with an answer key. */
export function treasureHuntEntries(grade: CoachGrade): GuideEntry[] {
  const a = grade === 1 ? 4 : grade === 2 ? 7 : 12;
  const b = grade === 1 ? 3 : grade === 2 ? 5 : 8;

  return [
    { title: "Math: Addition", body: `${a} + ${b} = ?  Answer: ${a + b}` },
    { title: "Math: Subtraction", body: `${a + b} − ${b} = ?  Answer: ${a}` },
    { title: "English: Opposite", body: "What is the opposite of hot?  Answer: Cold" },
    { title: "English: Plural", body: "What is the plural of cat?  Answer: Cats" },
    { title: "Hindi", body: "“सूरज” का पहला अक्षर क्या है?  Answer: स" },
    { title: "Hindi Number", body: "दो + तीन कितना होता है?  Answer: पाँच" },
    { title: "Gujarati", body: "“કમળ” નો પહેલો અક્ષર કયો?  Answer: ક" },
    { title: "Gujarati Number", body: "૪ પછી કયો અંક આવે?  Answer: ૫" },
    { title: "Shapes", body: "Which shape has 3 sides?  Answer: Triangle" },
    { title: "Shapes", body: "How many sides does a square have?  Answer: 4" },
    { title: "Answer-key rule", body: "Give the next location clue only after the child explains the answer." },
    {
      title: "How to play",
      body: "Write questions on paper, hide them around one room, add arrow clues, and place a star or coin at the final treasure.",
    },
  ];
}

/** A daily 30-minute routine made from three short micro-games. */
export function dailyRoutineEntries(): GuideEntry[] {
  return [
    {
      title: "0–10 min: English",
      body: "Play Word Hunt. Find 5 objects, say each English name, spell one easy word, and earn one star.",
    },
    {
      title: "10–20 min: Hindi + Gujarati",
      body: "Match 3 Hindi and 3 Gujarati letter cards to pictures. Read every letter and example aloud.",
    },
    {
      title: "20–30 min: Math",
      body: "Use the Visual Math Lab for one addition/subtraction story, then answer 3 Missing Number or Times Table questions.",
    },
    {
      title: "Finish with encouragement",
      body: "Review stars, ask “What was fun today?”, and let the child choose tomorrow's first micro-game.",
    },
  ];
}
