/**
 * A small bank of simple, kid-friendly "did you know?" trivia — mixed into
 * the Daily Challenge (see `createDailyChallengeGenerator`) alongside the
 * usual picture-identification questions, so the challenge isn't only ever
 * "what is this icon" but occasionally asks a general-knowledge question
 * too. Deliberately elementary-level (animals, space, nature, the human
 * body, everyday facts) to match the app's youngest-reader audience —
 * nothing here assumes reading beyond a short sentence.
 */
export interface GkFact {
  readonly id: string;
  readonly prompt: string;
  readonly correctAnswer: string;
  readonly distractors: readonly [string, string];
}

export const generalKnowledgeFacts: readonly GkFact[] = [
  { id: "gk-planet-home", prompt: "Which planet do we live on?", correctAnswer: "Earth", distractors: ["Mars", "Jupiter"] },
  { id: "gk-sun-star", prompt: "What is the closest star to Earth?", correctAnswer: "The Sun", distractors: ["The Moon", "Polaris"] },
  { id: "gk-rainbow-colors", prompt: "How many colors are in a rainbow?", correctAnswer: "7", distractors: ["5", "9"] },
  { id: "gk-week-days", prompt: "How many days are in a week?", correctAnswer: "7", distractors: ["5", "10"] },
  { id: "gk-year-months", prompt: "How many months are in a year?", correctAnswer: "12", distractors: ["10", "14"] },
  { id: "gk-continents", prompt: "How many continents are there?", correctAnswer: "7", distractors: ["5", "9"] },
  { id: "gk-oceans-largest", prompt: "Which is the largest ocean on Earth?", correctAnswer: "Pacific Ocean", distractors: ["Atlantic Ocean", "Indian Ocean"] },
  { id: "gk-lion-king", prompt: "Which animal is called the \"King of the Jungle\"?", correctAnswer: "Lion", distractors: ["Tiger", "Elephant"] },
  { id: "gk-tallest-animal", prompt: "Which is the tallest animal in the world?", correctAnswer: "Giraffe", distractors: ["Elephant", "Camel"] },
  { id: "gk-biggest-animal", prompt: "Which is the biggest animal in the world?", correctAnswer: "Blue whale", distractors: ["Elephant", "Shark"] },
  { id: "gk-fastest-land-animal", prompt: "Which is the fastest land animal?", correctAnswer: "Cheetah", distractors: ["Horse", "Lion"] },
  { id: "gk-spider-legs", prompt: "How many legs does a spider have?", correctAnswer: "8", distractors: ["6", "10"] },
  { id: "gk-insect-legs", prompt: "How many legs does an insect have?", correctAnswer: "6", distractors: ["4", "8"] },
  { id: "gk-bee-makes", prompt: "What do bees make?", correctAnswer: "Honey", distractors: ["Milk", "Silk"] },
  { id: "gk-spider-silk", prompt: "What do spiders spin to catch food?", correctAnswer: "A web", distractors: ["A nest", "A shell"] },
  { id: "gk-baby-dog", prompt: "What do we call a baby dog?", correctAnswer: "Puppy", distractors: ["Kitten", "Cub"] },
  { id: "gk-baby-cat", prompt: "What do we call a baby cat?", correctAnswer: "Kitten", distractors: ["Puppy", "Calf"] },
  { id: "gk-baby-cow", prompt: "What do we call a baby cow?", correctAnswer: "Calf", distractors: ["Kitten", "Foal"] },
  { id: "gk-frog-baby", prompt: "What is a baby frog called?", correctAnswer: "Tadpole", distractors: ["Cub", "Kit"] },
  { id: "gk-cow-drink", prompt: "What food comes from cows?", correctAnswer: "Milk", distractors: ["Honey", "Eggs"] },
  { id: "gk-hen-lays", prompt: "What do hens lay?", correctAnswer: "Eggs", distractors: ["Milk", "Honey"] },
  { id: "gk-biggest-planet", prompt: "Which is the largest planet in our solar system?", correctAnswer: "Jupiter", distractors: ["Earth", "Saturn"] },
  { id: "gk-red-planet", prompt: "Which planet is known as the \"Red Planet\"?", correctAnswer: "Mars", distractors: ["Venus", "Mercury"] },
  { id: "gk-plants-need", prompt: "What do plants need to grow, along with water and air?", correctAnswer: "Sunlight", distractors: ["Sand", "Ice"] },
  { id: "gk-fish-breathe", prompt: "What do fish use to breathe underwater?", correctAnswer: "Gills", distractors: ["Lungs", "Fins"] },
  { id: "gk-season-after-winter", prompt: "Which season comes right after winter?", correctAnswer: "Spring", distractors: ["Summer", "Autumn"] },
  { id: "gk-seasons-count", prompt: "How many seasons are there in a year?", correctAnswer: "4", distractors: ["3", "6"] },
  { id: "gk-heart-function", prompt: "Which part of your body pumps blood?", correctAnswer: "Heart", distractors: ["Lungs", "Brain"] },
  { id: "gk-lungs-function", prompt: "Which part of your body helps you breathe?", correctAnswer: "Lungs", distractors: ["Heart", "Stomach"] },
  { id: "gk-senses-count", prompt: "How many senses does a human body have?", correctAnswer: "5", distractors: ["3", "7"] },
  { id: "gk-triangle-sides", prompt: "How many sides does a triangle have?", correctAnswer: "3", distractors: ["4", "5"] },
  { id: "gk-square-sides", prompt: "How many sides does a square have?", correctAnswer: "4", distractors: ["3", "5"] },
  { id: "gk-earth-shape", prompt: "What shape is planet Earth?", correctAnswer: "A sphere (round)", distractors: ["A square", "A flat disc"] },
  { id: "gk-hottest-planet", prompt: "Which is the hottest planet in our solar system?", correctAnswer: "Venus", distractors: ["Mars", "Neptune"] },
  { id: "gk-national-animal-india", prompt: "What is the national animal of India?", correctAnswer: "Tiger", distractors: ["Lion", "Elephant"] },
  { id: "gk-national-bird-india", prompt: "What is the national bird of India?", correctAnswer: "Peacock", distractors: ["Parrot", "Eagle"] },
  { id: "gk-taj-mahal-country", prompt: "In which country is the Taj Mahal?", correctAnswer: "India", distractors: ["China", "Egypt"] },
  { id: "gk-camel-desert", prompt: "Which animal is known as the \"ship of the desert\"?", correctAnswer: "Camel", distractors: ["Horse", "Donkey"] },
  { id: "gk-owl-night", prompt: "Which bird is known for being awake at night?", correctAnswer: "Owl", distractors: ["Sparrow", "Peacock"] },
  { id: "gk-penguin-fly", prompt: "Which bird cannot fly but is a great swimmer?", correctAnswer: "Penguin", distractors: ["Eagle", "Pigeon"] },
];
