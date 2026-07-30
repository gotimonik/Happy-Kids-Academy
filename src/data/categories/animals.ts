import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Lion", "Tiger", "Elephant", "Dog", "Cat", "Cow", "Horse", "Monkey", "Bear", "Giraffe",
  "Zebra", "Deer", "Rabbit", "Fox", "Wolf", "Panda", "Kangaroo", "Camel", "Goat", "Sheep",
  "Pig", "Donkey", "Buffalo", "Rhinoceros", "Hippopotamus", "Leopard", "Cheetah", "Gorilla",
  "Chimpanzee", "Squirrel", "Mouse", "Rat", "Otter", "Beaver", "Mole", "Hedgehog", "Bat",
  "Sloth", "Koala", "Yak", "Llama", "Alpaca", "Antelope", "Hyena", "Jackal", "Mongoose",
  "Porcupine", "Raccoon", "Reindeer", "Seal",
] as const;

const ICONS = [
  "🦁", "🐯", "🐘", "🐶", "🐱", "🐄", "🐴", "🐒", "🐻", "🦒",
  "🦓", "🦌", "🐇", "🦊", "🐺", "🐼", "🦘", "🐫", "🐐", "🐑",
  "🐖", "🫏", "🐃", "🦏", "🦛", "🐆", "🐆", "🦍", "🐒", "🐿️",
  "🐁", "🐀", "🦦", "🦫", "🐾", "🦔", "🦇", "🦥", "🐨", "🐂",
  "🦙", "🦙", "🦌", "🐺", "🐺", "🐾", "🦔", "🦝", "🦌", "🦭",
] as const;

const SOUNDS = [
  "Roar", "Roar", "Trumpet", "Woof", "Meow", "Moo", "Neigh", "Chatter", "Growl", "",
  "", "Bellow", "", "", "", "", "", "", "Bleat", "Baa",
  "Oink", "Hee-haw", "", "Grunt", "Grunt", "Growl", "", "", "", "",
  "", "Squeak", "", "", "", "", "Screech", "", "", "",
  "", "", "", "", "Howl", "", "", "", "", "Bark",
] as const;

export const animalsCategory: LearningCategory = {
  slug: "animals",
  icon: "🐘",
  title: "Animals",
  subtitle: "50 animals • voice • sounds",
  color: "#00B894",
  trace: false,
  items: namedItems("animals", NAMES, ICONS, "Animal", SOUNDS),
};
