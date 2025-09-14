// no React import needed with React 17+ JSX transform

interface FoundListProps {
  words: string[];
}

function pointsFor(word: string): number {
  const uniq = new Set(word);
  const base = word.length === 4 ? 1 : word.length;
  return base + (uniq.size >= 7 ? 7 : 0);
}

export function FoundList({ words }: FoundListProps) {
  if (!words.length) return null;
  const rows = words.map((w) => ({
    word: w,
    len: w.length,
    pts: pointsFor(w),
  }));
  return (
    <div>
      <h3 className="font-semibold mb-2">Found words ({words.length})</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-sm border border-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-2 py-1 text-left border-b">word</th>
              <th className="px-2 py-1 text-right border-b">len</th>
              <th className="px-2 py-1 text-right border-b">pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.word} className="odd:bg-white even:bg-neutral-50">
                <td className="px-2 py-1 border-b font-mono uppercase">
                  {r.word}
                </td>
                <td className="px-2 py-1 border-b text-right">{r.len}</td>
                <td className="px-2 py-1 border-b text-right">{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
