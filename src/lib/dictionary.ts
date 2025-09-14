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

// New: load from word-datasets package (async iterator)
export async function loadDictionaryFromWordDatasets(
  maxLines?: number,
  datasetName = "words.txt"
): Promise<Dictionary> {
  // In the browser, prefer Vite's asset import from node_modules to avoid CORS and Node APIs
  if (typeof window !== "undefined") {
    try {
      // First, try public/ copy prepared at dev time
      const res = await fetch(`/word-datasets/${datasetName}`, {
        cache: "force-cache",
      });
      if (res.ok) {
        const text = await res.text();
        return normalizeWordList(text);
      }
    } catch (e) {
      console.error("Public copy fetch for word-datasets failed:", e);
    }
    // Last resort: try well-known CDNs
    const urls = [
      `https://cdn.jsdelivr.net/npm/word-datasets@latest/data/${datasetName}`,
      `https://unpkg.com/word-datasets@latest/data/${datasetName}`,
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "force-cache" });
        if (res.ok) {
          const text = await res.text();
          console.info(`Loaded word-datasets from CDN: ${url}`);
          return normalizeWordList(text);
        }
      } catch {
        // continue
      }
    }
    return [];
  }

  // Node/SSR path: use the package iterator
  const { listDatasets, iterTextLines } = await import("word-datasets");
  // eslint-disable-next-line no-console
  console.log("word-datasets available:", listDatasets?.() ?? []);
  const words: string[] = [];
  let i = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of iterTextLines(datasetName)) {
    const w = line.trim().toLowerCase();
    if (/^[a-z]+$/.test(w)) words.push(w);
    if (maxLines && ++i >= maxLines) break;
  }
  // eslint-disable-next-line no-console
  console.log(
    `Loaded ${words.length} words from word-datasets (${datasetName})`
  );
  return words;
}
