import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { GameState, Puzzle, StatsSummary } from "./types";
import {
  buildPuzzleFromPangram,
  computeStats,
  findRandomPangram,
  isAllowedWord,
  scoreWord,
} from "./lib/puzzle";
import { HexGrid } from "./components/HexGrid";
import { Controls } from "./components/Controls";
import { FoundList } from "./components/FoundList";
import { StatsPanel } from "./components/StatsPanel";
import wordsUrl from "./data/words.txt?url";

function App() {
  const [dictionary, setDictionary] = useState<string[] | null>(null);
  const [puzzle, setPuzzle] = useLocalStorage<Puzzle | null>(
    "bee:puzzle",
    null
  );
  const [game, setGame] = useLocalStorage<GameState>("bee:game", {
    foundWords: [],
    currentGuess: "",
  });
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(wordsUrl as string);
        if (res.ok) {
          const text = await res.text();
          const words = text
            .split(/\r?\n/)
            .map((w) => w.trim().toLowerCase())
            .filter((w) => /^[a-z]+$/.test(w) && w.length >= 3);
          setDictionary(words);
          setMessage(`Loaded ${words.length} words (local data/words.txt)`);
        } else {
          setMessage("Failed to load local data/words.txt");
        }
      } catch (e) {
        setMessage("Failed to load local data/words.txt");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats: StatsSummary | null = useMemo(() => {
    if (!puzzle) return null;
    return computeStats(puzzle.allowedWords, game.foundWords);
  }, [puzzle, game.foundWords]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 1200);
    return () => clearTimeout(t);
  }, [message]);

  const totalScore = useMemo(() => {
    if (!puzzle) return 0;
    return game.foundWords.reduce(
      (acc, w) => acc + scoreWord(w, puzzle.letters),
      0
    );
  }, [game.foundWords, puzzle]);

  function onGeneratePuzzle() {
    if (!dictionary) {
      setMessage("Dictionary not loaded yet");
      return;
    }
    const pangram = findRandomPangram(dictionary);
    if (!pangram) {
      setMessage("No pangram found (7-unique-letter word)");
      return;
    }
    const p = buildPuzzleFromPangram(dictionary, pangram);
    if (!p) {
      setMessage("Failed to build puzzle");
      return;
    }
    setPuzzle(p);
    setGame({ foundWords: [], currentGuess: "" });
    setMessage(`Puzzle from: ${pangram}`);
  }

  function onPick(letter: string) {
    setGame((g) => ({ ...g, currentGuess: g.currentGuess + letter }));
  }

  function onBackspace() {
    setGame((g) => ({ ...g, currentGuess: g.currentGuess.slice(0, -1) }));
  }

  function onClear() {
    setGame((g) => ({ ...g, currentGuess: "" }));
  }

  function onShuffle() {
    if (!puzzle) return;
    const others = puzzle.letters.filter((l) => l !== puzzle.center);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    setPuzzle({ ...puzzle, letters: [puzzle.center, ...shuffled] });
  }

  function onSubmit() {
    if (!puzzle) return;
    const guess = game.currentGuess.toLowerCase();
    if (!guess) return;
    if (game.foundWords.includes(guess)) {
      setMessage("Already found");
      return;
    }
    if (!isAllowedWord(guess, puzzle.letters, puzzle.center)) {
      setMessage("Invalid");
      return;
    }
    if (!puzzle.allowedWords.includes(guess)) {
      setMessage("Not in list");
      return;
    }
    setGame((g) => ({
      ...g,
      foundWords: [...g.foundWords, guess].sort(),
      currentGuess: "",
    }));
    setMessage("Nice!");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!puzzle) return;
    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key)) {
      const allowed = new Set(puzzle.letters);
      if (allowed.has(key)) {
        e.preventDefault();
        onPick(key);
      }
    } else if (key === "backspace") {
      e.preventDefault();
      onBackspace();
    } else if (key === "enter") {
      e.preventDefault();
      onSubmit();
    } else if (key === "escape") {
      e.preventDefault();
      onClear();
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <header className="p-4 border-b border-neutral-200 flex flex-wrap gap-3 items-center justify-between max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Better Spelling Bee
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={onGeneratePuzzle}
            title="Randomize puzzle"
          >
            Randomize
          </button>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const input = form.elements.namedItem(
                "seed"
              ) as HTMLInputElement | null;
              const seed = input?.value?.trim().toLowerCase() || "";
              if (!dictionary || seed.length < 7) return;
              const p = buildPuzzleFromPangram(dictionary, seed);
              if (p) {
                setPuzzle(p);
                setGame({ foundWords: [], currentGuess: "" });
                setMessage(`Custom puzzle from: ${seed}`);
              } else {
                setMessage("Seed must have exactly 7 unique letters");
              }
            }}
          >
            <input
              name="seed"
              placeholder="custom 7-unique-letter word"
              className="px-3 py-2 rounded border border-neutral-300 w-64"
            />
            <button className="px-4 py-2 rounded bg-amber-300 hover:bg-amber-400 text-neutral-900 font-semibold">
              Start
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-6 grid gap-8 md:grid-cols-2 max-w-6xl mx-auto w-full">
        <section className="grid gap-6 content-start">
          {!puzzle ? (
            <div className="text-neutral-600">
              Click Randomize or provide a custom seed.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <HexGrid
                  letters={puzzle.letters}
                  center={puzzle.center}
                  onPick={onPick}
                />
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold tracking-wide uppercase font-mono">
                  {game.currentGuess || " "}
                </div>
                <div className="text-base md:text-lg text-neutral-600">
                  Score: {totalScore} / Words: {game.foundWords.length} / Total:{" "}
                  {puzzle.allowedWords.length}
                </div>
              </div>
              <Controls
                onShuffle={onShuffle}
                onBackspace={onBackspace}
                onSubmit={onSubmit}
                onClear={onClear}
              />
              <FoundList words={game.foundWords} />
            </>
          )}
        </section>
        <aside className="grid gap-4 content-start min-w-0">
          <div className="text-sm text-neutral-600">{message}</div>
          <StatsPanel stats={stats} />
        </aside>
      </main>

      <footer className="p-4 text-center text-xs text-neutral-500 border-t border-neutral-200 max-w-6xl mx-auto w-full">
        Custom seed requires a word with exactly seven unique letters.
      </footer>
    </div>
  );
}

export default App;
