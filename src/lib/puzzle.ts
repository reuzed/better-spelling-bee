import type { Dictionary, Puzzle, StatsSummary } from "../types";

export function buildPuzzleFromPangram(
  dictionary: Dictionary,
  pangram: string,
  centerLetter?: string
): Puzzle | null {
  const letters = Array.from(new Set(pangram.split("")));
  if (letters.length !== 7) return null;
  const center =
    centerLetter && letters.includes(centerLetter) ? centerLetter : letters[0];
  const allowedWords = dictionary.filter((w) =>
    isAllowedWord(w, letters, center)
  );
  return {
    letters,
    center,
    allowedWords: Array.from(new Set(allowedWords)).sort(),
    pangram,
  };
}

export function findRandomPangram(dictionary: Dictionary): string | null {
  const candidates = dictionary.filter(
    (w) => new Set(w).size === 7 && w.length >= 7
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function isAllowedWord(
  word: string,
  letters: string[],
  center: string
): boolean {
  if (word.length < 4) return false;
  if (!word.includes(center)) return false;
  const allowed = new Set(letters);
  for (const ch of word) {
    if (!allowed.has(ch)) return false;
  }
  return true;
}

export function scoreWord(word: string, letters: string[]): number {
  // Basic scoring similar to Spelling Bee: 1 point for 4 letters, otherwise length, +7 pangram bonus
  const unique = new Set(word);
  const isPangram = unique.size === letters.length;
  const base = word.length === 4 ? 1 : word.length;
  return base + (isPangram ? 7 : 0);
}

export function computeStats(
  puzzleWords: string[],
  foundWords: string[]
): StatsSummary {
  const foundSet = new Set(foundWords);
  const byLengthAndFirst: StatsSummary["byLengthAndFirst"] = {};
  const byFirstTwo: StatsSummary["byFirstTwo"] = {};
  const byLengthAndFirstTwo: NonNullable<StatsSummary["byLengthAndFirstTwo"]> =
    {};
  const byLengthAndFirstThree: NonNullable<
    StatsSummary["byLengthAndFirstThree"]
  > = {};

  for (const w of puzzleWords) {
    const key1 = `${w.length}-${w[0]}`;
    const key2 = w.length >= 2 ? w.slice(0, 2) : `${w[0]}_`;
    const key3 = `${w.length}-${key2}`;
    const prefix3 =
      w.length >= 3
        ? w.slice(0, 3)
        : `${w}${"_".repeat(Math.max(0, 3 - w.length))}`;
    const key4 = `${w.length}-${prefix3}`;
    const isFound = foundSet.has(w);
    if (!byLengthAndFirst[key1])
      byLengthAndFirst[key1] = { total: 0, found: 0 };
    if (!byFirstTwo[key2]) byFirstTwo[key2] = { total: 0, found: 0 };
    if (!byLengthAndFirstTwo[key3])
      byLengthAndFirstTwo[key3] = { total: 0, found: 0 };
    if (!byLengthAndFirstThree[key4])
      byLengthAndFirstThree[key4] = { total: 0, found: 0 };
    byLengthAndFirst[key1].total += 1;
    byFirstTwo[key2].total += 1;
    byLengthAndFirstTwo[key3].total += 1;
    byLengthAndFirstThree[key4].total += 1;
    if (isFound) {
      byLengthAndFirst[key1].found += 1;
      byFirstTwo[key2].found += 1;
      byLengthAndFirstTwo[key3].found += 1;
      byLengthAndFirstThree[key4].found += 1;
    }
  }

  return {
    byLengthAndFirst,
    byFirstTwo,
    byLengthAndFirstTwo,
    byLengthAndFirstThree,
  };
}
