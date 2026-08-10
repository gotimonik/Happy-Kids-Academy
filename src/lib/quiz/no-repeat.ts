import { shuffle } from "./utils";

/**
 * Wraps a question generator that draws from a finite, enumerable set of
 * "keys" — an item id, a letter index, a number, a parameter pair, whatever
 * uniquely identifies one possible question — so a quiz session stops
 * re-asking the same one so often.
 *
 * Every quiz screen (category, Mixed Quiz, and each grade game) previously
 * picked its next question with a fresh `Math.random()` call every round,
 * with no memory of earlier rounds. That's fine in isolation, but the
 * birthday paradox makes repeats within one 10-round quiz common whenever
 * the pool of possible questions isn't much bigger than 10 — e.g. Word
 * Builder draws from only 26 letters, so a plain-random 10-round quiz has
 * roughly an 85% chance of repeating at least one letter.
 *
 * This is the classic "shuffle bag" fix instead: every key is dealt out
 * once, in random order, before any key repeats. Refilling an emptied bag
 * rerolls its first draw if that would repeat the key that just emptied the
 * previous bag, so the reshuffle boundary itself never reads as an instant
 * back-to-back repeat.
 */
export function createNoRepeatGenerator<Key, Question>(
  domain: readonly Key[],
  build: (key: Key) => Question,
): () => Question {
  if (domain.length === 0) {
    throw new Error("createNoRepeatGenerator needs a non-empty domain");
  }

  let bag: Key[] = [];
  let lastKey: Key | undefined;

  function refill() {
    bag = shuffle(domain);
    const top = bag.length - 1;
    // Draws pop from the end of `bag` — if a single-key domain reshuffled
    // to the same order that's unavoidable (nothing else to draw), but for
    // anything bigger, swap the about-to-be-dealt slot with another one so
    // the new bag's first draw isn't the key that just emptied the old bag.
    if (bag.length > 1 && bag[top] === lastKey) {
      const swapWith = Math.floor(Math.random() * top);
      [bag[top], bag[swapWith]] = [bag[swapWith] as Key, bag[top] as Key];
    }
  }

  return () => {
    if (bag.length === 0) refill();
    const key = bag.pop() as Key;
    lastKey = key;
    return build(key);
  };
}
