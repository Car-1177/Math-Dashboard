import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

export type SearchEntry = {
  id: string;
  label: string;
  group: string;
  keywords: string[];
};

export function SearchBar({
  entries,
  onSelect,
}: {
  entries: SearchEntry[];
  onSelect: (id: string) => void;
}) {
  const accent = useAccent();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries
      .filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.group.toLowerCase().includes(q) ||
          e.keywords.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, entries]);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 focus-within:border-slate-500">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search tools, formulas, topics…"
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <X className="h-4 w-4 text-slate-400 hover:text-white" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">No matching tools.</p>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onMouseDown={() => {
                  onSelect(r.id);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", accent.solid)} />
                  {r.label}
                </span>
                <span className="text-xs uppercase tracking-wide text-slate-500">{r.group}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}