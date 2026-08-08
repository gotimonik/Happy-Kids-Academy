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

// Every animal has its own distinct icon — no two entries share a picture.
// Unicode doesn't have a dedicated emoji for several close relatives here
// (cheetah, chimpanzee, alpaca, antelope, hyena, jackal, mongoose,
// porcupine, reindeer, ...), so those use the closest distinct stand-in
// instead of reusing another animal's exact icon (e.g. leopard and cheetah
// previously showed the identical 🐆, wolf/hyena/jackal all showed 🐺, and
// so on).
const ICONS = [
  "🦁", "🐯", "🐘", "🐶", "🐱", "🐄", "🐴", "🐒", "🐻", "🦒",
  "🦓", "🦌", "🐇", "🦊", "🐺", "🐼", "🦘", "🐫", "🐐", "🐑",
  "🐖", "🫏", "🐃", "🦏", "🦛", "🐆", "🐅", "🦍", "🐵", "🐿️",
  "🐁", "🐀", "🦦", "🦫", "🐹", "🦔", "🦇", "🦥", "🐨", "🐂",
  "🦙", "🐏", "🦬", "🐕", "🦡", "🦨", "🐗", "🦝", "❄️", "🦭",
] as const;

const SOUNDS = [
  "Roar",        // Lion
  "Roar",        // Tiger
  "Trumpet",     // Elephant
  "Bark",        // Dog
  "Meow",        // Cat
  "Moo",         // Cow
  "Neigh",       // Horse
  "Chatter",     // Monkey
  "Growl",       // Bear
  "Hum",         // Giraffe
  "Whinny",      // Zebra
  "Bleat",       // Deer
  "Squeak",      // Rabbit
  "Yelp",        // Fox
  "Howl",        // Wolf
  "Bleat",       // Panda
  "Chortle",     // Kangaroo
  "Grunt",       // Camel
  "Bleat",       // Goat
  "Baa",         // Sheep
  "Oink",        // Pig
  "Bray",        // Donkey
  "Bellow",      // Buffalo
  "Snort",       // Rhinoceros
  "Grunt",       // Hippopotamus
  "Growl",       // Leopard
  "Chirp",       // Cheetah
  "Grunt",       // Gorilla
  "Hoot",        // Chimpanzee
  "Chatter",     // Squirrel
  "Squeak",      // Mouse
  "Squeak",      // Rat
  "Chirp",       // Otter
  "Slap",        // Beaver
  "Squeak",      // Mole
  "Snuffle",     // Hedgehog
  "Screech",     // Bat
  "Squeak",      // Sloth
  "Bellow",      // Koala
  "Grunt",       // Yak
  "Hum",         // Llama
  "Hum",         // Alpaca
  "Snort",       // Antelope
  "Laugh",       // Hyena
  "Howl",        // Jackal
  "Chatter",     // Mongoose
  "Chatter",     // Porcupine
  "Chitter",     // Raccoon
  "Grunt",       // Reindeer
  "Bark",        // Seal
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
