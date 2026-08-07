/**
 * Content for the Living World scene (Sleepy Animals + Rain Mode combined):
 * a small hand-picked cast, each with a reaction line for every combination
 * of time-of-day and weather. Hand-picked rather than pulled from
 * `data/categories/animals.ts` because not every one of the 50 animals has a
 * natural "what does it do at night / in the rain" answer — this cast was
 * chosen because each member's reaction teaches something (ducks love rain,
 * owls are nocturnal) rather than being a generic filler line.
 */

export type TimeOfDay = "day" | "night";
export type Weather = "clear" | "rain";

export interface LivingWorldCastMember {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  /** Reaction line, keyed by `${timeOfDay}-${weather}`. */
  readonly reactions: Readonly<Record<`${TimeOfDay}-${Weather}`, string>>;
}

export const LIVING_WORLD_CAST: readonly LivingWorldCastMember[] = [
  {
    id: "cat",
    icon: "🐱",
    label: "Cat",
    reactions: {
      "day-clear": "Meow! Let's play.",
      "day-rain": "Hiding under the porch — cats don't like getting wet!",
      "night-clear": "Curled up fast asleep.",
      "night-rain": "Fast asleep, all cozy and dry.",
    },
  },
  {
    id: "dog",
    icon: "🐶",
    label: "Dog",
    reactions: {
      "day-clear": "Woof! Ready to fetch.",
      "day-rain": "Shaking off the raindrops — woof woof!",
      "night-clear": "Snoozing in its bed.",
      "night-rain": "Snoozing, dreaming of sunny walks.",
    },
  },
  {
    id: "duck",
    icon: "🦆",
    label: "Duck",
    reactions: {
      "day-clear": "Quack! Off to the pond.",
      "day-rain": "Quack quack! Ducks LOVE the rain.",
      "night-clear": "Tucked its head under a wing.",
      "night-rain": "Sleeping happily through the drizzle.",
    },
  },
  {
    id: "rabbit",
    icon: "🐇",
    label: "Rabbit",
    reactions: {
      "day-clear": "A happy little hop!",
      "day-rain": "Hopping through the puddles!",
      "night-clear": "Snug and asleep in its burrow.",
      "night-rain": "Warm and dry underground.",
    },
  },
  {
    id: "owl",
    icon: "🦉",
    label: "Owl",
    reactions: {
      "day-clear": "Blinking sleepily — owls rest during the day.",
      "day-rain": "Hoo! Waiting out the rain, half-asleep.",
      "night-clear": "Wide awake! Owls love the night.",
      "night-rain": "Hoo! Hunting under the moonlit rain.",
    },
  },
  {
    id: "lion",
    icon: "🦁",
    label: "Lion",
    reactions: {
      "day-clear": "Roar! Ruler of the day.",
      "day-rain": "Shaking its mane dry — roar!",
      "night-clear": "Resting under a starry sky.",
      "night-rain": "Sheltering from the night rain.",
    },
  },
];
