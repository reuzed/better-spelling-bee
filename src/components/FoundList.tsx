// no React import needed with React 17+ JSX transform

interface FoundListProps {
  words: string[];
}

export function FoundList({ words }: FoundListProps) {
  if (!words.length) return null;
  return (
    <div>
      <h3 className="font-semibold mb-2">Found words ({words.length})</h3>
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <span
            key={w}
            className="px-2 py-1 rounded bg-neutral-100 border border-neutral-200"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
