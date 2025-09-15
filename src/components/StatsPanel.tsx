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
        <div className="p-2 overflow-x-auto">
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
        <div className="p-2 overflow-x-auto">
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
        <div className="p-2 overflow-x-auto">
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

      <details className="rounded border border-neutral-200" open={false}>
        <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
          First Letter × Second Letter
        </summary>
        <div className="p-2 overflow-x-auto">
          {(() => {
            const firstSet = new Set<string>();
            const secondSet = new Set<string>();
            const map = stats.byFirstAndSecond || {};
            for (const key of Object.keys(map)) {
              const [f, s] = key.split("-");
              if (f) firstSet.add(f);
              if (s) secondSet.add(s);
            }
            const firsts = Array.from(firstSet).sort((a, b) =>
              a.localeCompare(b)
            );
            const seconds = Array.from(secondSet).sort((a, b) =>
              a.localeCompare(b)
            );
            return (
              <table className="text-[11px] md:text-xs border border-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-2 py-1 border-b border-r text-left">
                      first \\ second
                    </th>
                    {seconds.map((s) => (
                      <th
                        key={s}
                        className="px-2 py-1 border-b border-r font-mono"
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {firsts.map((f) => (
                    <tr key={f} className="odd:bg-white even:bg-neutral-50">
                      <th className="px-2 py-1 border-r border-b text-right font-semibold">
                        {f}
                      </th>
                      {seconds.map((s) => {
                        const k = `${f}-${s}`;
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

      <details className="rounded border border-neutral-200" open={false}>
        <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
          Second-last Letter × Last Letter
        </summary>
        <div className="p-2 overflow-x-auto">
          {(() => {
            const beforeSet = new Set<string>();
            const lastSet = new Set<string>();
            const map = stats.bySecondLastAndLast || {};
            for (const key of Object.keys(map)) {
              const [b, l] = key.split("-");
              if (b) beforeSet.add(b);
              if (l) lastSet.add(l);
            }
            const befores = Array.from(beforeSet).sort((a, b) =>
              a.localeCompare(b)
            );
            const lasts = Array.from(lastSet).sort((a, b) =>
              a.localeCompare(b)
            );
            return (
              <table className="text-[11px] md:text-xs border border-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-2 py-1 border-b border-r text-left">
                      prev \\ last
                    </th>
                    {lasts.map((l) => (
                      <th
                        key={l}
                        className="px-2 py-1 border-b border-r font-mono"
                      >
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {befores.map((b) => (
                    <tr key={b} className="odd:bg-white even:bg-neutral-50">
                      <th className="px-2 py-1 border-r border-b text-right font-semibold">
                        {b}
                      </th>
                      {lasts.map((l) => {
                        const k = `${b}-${l}`;
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
