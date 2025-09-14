export type Dictionary = string[];

export interface Puzzle {
  letters: string[]; // All 7 letters (lowercase)
  center: string; // One of letters
  allowedWords: string[]; // All valid words for this puzzle
  pangram: string; // The word used to seed the puzzle (7 unique letters)
}

export interface GameState {
  foundWords: string[];
  currentGuess: string;
}

export interface StatsSummary {
  byLengthAndFirst: Record<string, { total: number; found: number }>;
  byFirstTwo: Record<string, { total: number; found: number }>;
}
