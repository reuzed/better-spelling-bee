import type { Dictionary } from "../types";

export async function loadDictionaryFromFile(file: File): Promise<Dictionary> {
  const text = await file.text();
  return normalizeWordList(text);
}

export function normalizeWordList(text: string): Dictionary {
  return text
    .split(/\r?\n/) // split lines
    .map((w) => w.trim().toLowerCase())
    .filter((w) => /^[a-z]+$/.test(w) && w.length >= 3);
}

export function lettersOf(word: string): string[] {
  return Array.from(new Set(word.split("")));
}

export function isSevenUniqueLetters(word: string): boolean {
  const s = new Set(word);
  return s.size === 7;
}
