import type { LearningCategory } from "@/types/category";
import type { LearningItem as Item } from "@/types/item";

// A different everyday object for each of the ten add/subtract/multiply/divide
// facts below, so the ten paragraphs in each family don't all lean on the
// same "picture X of these" example.
const OBJECTS = [
  "crayons", "apples", "stickers", "building blocks", "marbles",
  "cookies", "balloons", "socks", "coins", "toy cars",
];

let autoId = 0;
function fact(expression: string, answer: string, type: string, longDescription: string): Item {
  autoId += 1;
  return {
    id: `math-${autoId}`,
    label: answer,
    detail: type,
    speech: `${expression} equals ${answer}`,
    longDescription,
  };
}

function describeAddition(i: number): string {
  const object = OBJECTS[(i - 1) % OBJECTS.length];
  const total = i + i;
  return [
    `When you add ${i} and ${i} together, you're combining two equal groups of ${i} into one bigger group.`,
    `Mathematicians call this doubling, because you're taking a number and adding it to itself.`,
    `Picture ${i} ${object} in your left hand and ${i} more ${object} in your right hand — put them all in one pile and you'll count ${total} in total.`,
    `Addition like this is one of the very first math skills children learn, and doubling numbers is a great way to practice counting by twos.`,
    `So remember: ${i} + ${i} always equals ${total}.`,
  ].join(" ");
}

function describeSubtraction(i: number): string {
  const object = OBJECTS[(i - 1) % OBJECTS.length];
  const start = i + 5;
  return [
    `Subtraction is all about taking away.`,
    `If you start with ${start} ${object} and give away ${i} of them, you're left with exactly 5, because ${start} − ${i} = 5.`,
    `Think of it like having ${start} ${object} on the table and putting ${i} of them back in the box — count what remains and you'll find 5.`,
    `Subtraction helps us figure out how many are left after some are eaten, given away, or put away.`,
    `No matter how big the starting number gets, this particular equation always leaves you with 5.`,
  ].join(" ");
}

function describeMultiplication(i: number): string {
  const object = OBJECTS[(i - 1) % OBJECTS.length];
  const total = i * 2;
  return [
    `Multiplication is a fast way to add the same number over and over.`,
    `${i} × 2 means ${i} groups of 2 — or you could think of it as 2 groups of ${i} — and either way, adding them all up gives you ${total}.`,
    `Imagine ${i} pairs of ${object} lined up in a row; since each pair has 2, there are ${total} altogether.`,
    `Multiplying by 2 is also called doubling, and it's one of the easiest multiplication facts to learn by heart.`,
    `Once you know how to double a number, ${i} × 2 will always come out to ${total}.`,
  ].join(" ");
}

function describeDivision(i: number): string {
  const object = OBJECTS[(i - 1) % OBJECTS.length];
  const start = i * 2;
  return [
    `Division is all about sharing something equally.`,
    `If you have ${start} ${object} and want to split them into 2 equal groups, each group gets exactly ${i}.`,
    `Imagine ${start} ${object} shared evenly between 2 friends — each friend would end up with ${i}.`,
    `Division is really the opposite of multiplication, so it makes sense that ${start} ÷ 2 brings you right back to ${i}.`,
    `Learning to divide is what helps you share fairly with friends and family.`,
  ].join(" ");
}

const GREATER_THAN_DESCRIPTION = [
  `The greater than sign (>) is used to show that one number is bigger than another.`,
  `In 8 > 3, the wide open side of the symbol faces the 8, because 8 is the bigger number, and the pointy side faces the smaller number, 3.`,
  `A handy trick is to remember the symbol as a hungry alligator mouth — it always opens wide toward whichever number it wants to "eat", which is the bigger one.`,
  `If you had 8 stickers and your friend had 3, you'd have more, so you could proudly say "8 is greater than 3."`,
  `Comparing numbers this way helps you decide which of two amounts is larger.`,
].join(" ");

const LESS_THAN_DESCRIPTION = [
  `The less than sign (<) is used to show that one number is smaller than another.`,
  `In 2 < 7, the pointy side of the symbol faces the smaller number, 2, while the wide open side faces the bigger number, 7.`,
  `Using the hungry alligator trick, the alligator's mouth still opens toward the bigger number — it just happens to be written on the right side this time.`,
  `If you had 2 cookies and your friend had 7, you'd have fewer, so you could say "2 is less than 7."`,
  `Learning the less than sign is just as useful as learning greater than, since comparing amounts goes both ways.`,
].join(" ");

const EQUAL_TO_DESCRIPTION = [
  `The equal sign (=) shows that two amounts are exactly the same.`,
  `In 5 = 5, both sides match perfectly, so neither side is bigger or smaller than the other.`,
  `If you had 5 marbles and your friend also had 5 marbles, you'd both have the very same amount — that's what "equal" means.`,
  `The equal sign shows up everywhere in math, from simple counting to much bigger equations later on.`,
  `Whenever both sides of a comparison balance perfectly, you reach for the equal sign instead of greater than or less than.`,
].join(" ");

const items: Item[] = [];
for (let i = 1; i <= 10; i += 1) {
  items.push(fact(`${i} + ${i}`, String(i + i), "Addition", describeAddition(i)));
  items.push(fact(`${i + 5} − ${i}`, "5", "Subtraction", describeSubtraction(i)));
}
for (let i = 1; i <= 10; i += 1) {
  items.push(fact(`${i} × 2`, String(i * 2), "Multiplication", describeMultiplication(i)));
}
for (let i = 1; i <= 10; i += 1) {
  items.push(fact(`${i * 2} ÷ 2`, String(i), "Division", describeDivision(i)));
}
items.push(fact("8 > 3", "Greater than", "Comparison", GREATER_THAN_DESCRIPTION));
items.push(fact("2 < 7", "Less than", "Comparison", LESS_THAN_DESCRIPTION));
items.push(fact("5 = 5", "Equal to", "Comparison", EQUAL_TO_DESCRIPTION));

// `symbol` for math facts is the expression itself (shown large on the flashcard).
const withExpressions: Item[] = items.map((item, index) => {
  const expression = item.speech.split(" equals ")[0] ?? item.label;
  return { ...item, id: `math-${index + 1}`, symbol: expression };
});

export const mathCategory: LearningCategory = {
  slug: "math",
  icon: "+ −",
  title: "Math",
  subtitle: "Add • subtract • multiply • divide",
  color: "#37C183",
  trace: false,
  items: withExpressions,
};
