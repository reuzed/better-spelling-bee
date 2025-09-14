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

  // Build axes for matrix
  const lengthSet = new Set<number>();
  const letterSet = new Set<string>();
  for (const [key] of entries1) {
    const [lenStr, first] = key.split("-");
    const len = Number(lenStr);
    if (!Number.isNaN(len)) lengthSet.add(len);
    if (first) letterSet.add(first);
  }
  const lengths = Array.from(lengthSet).sort((a, b) => a - b);
  const letters = Array.from(letterSet).sort((a, b) => a.localeCompare(b));

  return (
    <div className="grid gap-4">
      <details className="rounded border border-neutral-200" open={false}>
        <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
          Length × First Letter
        </summary>
        <div className="p-2 overflow-auto">
          <table className="text-[11px] md:text-xs border border-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-2 py-1 border-b border-r text-left">
                  len \\ letter
                </th>
                {letters.map((L) => (
                  <th key={L} className="px-2 py-1 border-b border-r font-mono">
                    {L}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lengths.map((len) => (
                <tr key={len} className="odd:bg-white even:bg-neutral-50">
                  <th className="px-2 py-1 border-r border-b text-right font-semibold">
                    {len}
                  </th>
                  {letters.map((L) => {
                    const k = `${len}-${L}`;
                    const cell = stats.byLengthAndFirst[k];
                    const total = cell?.total ?? 0;
                    const found = cell?.found ?? 0;
                    const remaining = Math.max(0, total - found);
                    return (
                      <td
                        key={k}
                        title={`${found} / ${total}`}
                        className={`px-2 py-1 border-r border-b text-center font-mono ${
                          remaining === 0
                            ? "bg-green-100 text-green-900"
                            : total === 0
                            ? "text-neutral-300"
                            : ""
                        }`}
                      >
                        {total === 0 ? "" : remaining}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <details className="rounded border border-neutral-200" open={false}>
        <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
          Length × First Two Letters
        </summary>
        <div className="p-2 overflow-auto">
          {(() => {
            const lenSet = new Set<number>();
            const prefixSet = new Set<string>();
            const map = stats.byLengthAndFirstTwo || {};
            for (const key of Object.keys(map)) {
              const [lenStr, prefix] = key.split("-");
              const len = Number(lenStr);
              if (!Number.isNaN(len)) lenSet.add(len);
              if (prefix) prefixSet.add(prefix);
            }
            const lengths = Array.from(lenSet).sort((a, b) => a - b);
            const prefixes = Array.from(prefixSet).sort((a, b) =>
              a.localeCompare(b)
            );
            return (
              <table className="text-[11px] md:text-xs border border-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-2 py-1 border-b border-r text-left">
                      len \\ prefix
                    </th>
                    {prefixes.map((p) => (
                      <th
                        key={p}
                        className="px-2 py-1 border-b border-r font-mono"
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lengths.map((len) => (
                    <tr key={len} className="odd:bg-white even:bg-neutral-50">
                      <th className="px-2 py-1 border-r border-b text-right font-semibold">
                        {len}
                      </th>
                      {prefixes.map((p) => {
                        const k = `${len}-${p}`;
                        const cell = map[k];
                        const total = cell?.total ?? 0;
                        const found = cell?.found ?? 0;
                        const remaining = Math.max(0, total - found);
                        return (
                          <td
                            key={k}
                            title={`${found} / ${total}`}
                            className={`px-2 py-1 border-r border-b text-center font-mono ${
                              remaining === 0
                                ? "bg-green-100 text-green-900"
                                : total === 0
                                ? "text-neutral-300"
                                : ""
                            }`}
                          >
                            {total === 0 ? "" : remaining}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
          <div className="mt-2 text-xs text-neutral-600">
            Totals by two-letter prefix:
            <div className="flex flex-wrap gap-2 mt-1">
              {entries2.map(([prefix, v]) => (
                <span
                  key={prefix}
                  className="px-2 py-1 rounded border border-neutral-200 font-mono"
                >
                  {prefix}: {v.total}
                </span>
              ))}
            </div>
          </div>
        </div>
      </details>

      <details className="rounded border border-neutral-200" open={false}>
        <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
          Length × First Three Letters
        </summary>
        <div className="p-2 overflow-auto">
          {(() => {
            const lenSet = new Set<number>();
            const prefixSet = new Set<string>();
            const map = stats.byLengthAndFirstThree || {};
            for (const key of Object.keys(map)) {
              const [lenStr, prefix] = key.split("-");
              const len = Number(lenStr);
              if (!Number.isNaN(len)) lenSet.add(len);
              if (prefix) prefixSet.add(prefix);
            }
            const lengths = Array.from(lenSet).sort((a, b) => a - b);
            const prefixes = Array.from(prefixSet).sort((a, b) =>
              a.localeCompare(b)
            );
            return (
              <table className="text-[11px] md:text-xs border border-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-2 py-1 border-b border-r text-left">
                      len \\ prefix
                    </th>
                    {prefixes.map((p) => (
                      <th
                        key={p}
                        className="px-2 py-1 border-b border-r font-mono"
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lengths.map((len) => (
                    <tr key={len} className="odd:bg-white even:bg-neutral-50">
                      <th className="px-2 py-1 border-r border-b text-right font-semibold">
                        {len}
                      </th>
                      {prefixes.map((p) => {
                        const k = `${len}-${p}`;
                        const cell = map[k];
                        const total = cell?.total ?? 0;
                        const found = cell?.found ?? 0;
                        const remaining = Math.max(0, total - found);
                        return (
                          <td
                            key={k}
                            title={`${found} / ${total}`}
                            className={`px-2 py-1 border-r border-b text-center font-mono ${
                              remaining === 0
                                ? "bg-green-100 text-green-900"
                                : total === 0
                                ? "text-neutral-300"
                                : ""
                            }`}
                          >
                            {total === 0 ? "" : remaining}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>
      </details>
    </div>
  );
}
