import type { StatsSummary } from "../types";

interface StatsPanelProps {
  stats: StatsSummary | null;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) return null;
  const entries1 = Object.entries(stats.byLengthAndFirst).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const entries2 = Object.entries(stats.byFirstTwo).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2">By length + first letter</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {entries1.map(([key, v]) => (
            <div key={key} className="rounded border border-neutral-200 p-2">
              <div className="font-mono">{key}</div>
              <div>
                {v.found} / {v.total}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">By first two letters</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 text-sm">
          {entries2.map(([key, v]) => (
            <div key={key} className="rounded border border-neutral-200 p-2">
              <div className="font-mono">{key}</div>
              <div>
                {v.found} / {v.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
