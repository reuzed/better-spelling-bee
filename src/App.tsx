import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { GameState, Puzzle, StatsSummary } from "./types";
import { loadDictionaryFromFile } from "./lib/dictionary";
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

  function onUploadDictionary(file: File) {
    loadDictionaryFromFile(file).then((dict) => {
      setDictionary(dict);
      setMessage(`Loaded ${dict.length} words`);
    });
  }

  function onGeneratePuzzle() {
    if (!dictionary) {
      setMessage("Load a dictionary first");
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
      <header className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Better Spelling Bee</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".txt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUploadDictionary(f);
            }}
          />
          <button
            className="px-3 py-2 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={onGeneratePuzzle}
          >
            Generate
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <section className="grid gap-4 content-start">
          {!puzzle ? (
            <div className="text-neutral-600">
              Load a dictionary .txt and click Generate.
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
                <div className="text-3xl font-bold tracking-wide uppercase font-mono">
                  {game.currentGuess || " "}
                </div>
                <div className="text-sm text-neutral-500">
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
        <aside className="grid gap-4 content-start">
          <div className="text-sm text-neutral-600">{message}</div>
          <StatsPanel stats={stats} />
        </aside>
      </main>

      <footer className="p-4 text-center text-xs text-neutral-500 border-t border-neutral-200">
        Upload any English word list. Puzzle requires a seed word with exactly
        seven unique letters.
      </footer>
    </div>
  );
}

export default App;
