import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";
import { X, Keyboard } from "lucide-react";

export type ShortcutGroup = {
  title: string;
  items: { keys: string[]; label: string }[];
};

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Navigation",
    items: [
      { keys: ["/"], label: "Focus the search bar" },
      { keys: ["?"], label: "Open this shortcuts panel" },
      { keys: ["Esc"], label: "Close panels / clear search" },
      { keys: ["g", "c"], label: "Go to Calculator" },
      { keys: ["g", "s"], label: "Go to Statistics" },
      { keys: ["g", "q"], label: "Go to Quadratics" },
      { keys: ["g", "p"], label: "Go to Polynomials" },
      { keys: ["g", "d"], label: "Go to Coordinate geometry" },
      { keys: ["g", "m"], label: "Go to Community Q&A" },
    ],
  },
  {
    title: "Calculator",
    items: [
      { keys: ["0-9"], label: "Digits" },
      { keys: ["+", "-", "*", "/"], label: "Operators" },
      { keys: ["^"], label: "Exponent" },
      { keys: ["(", ")"], label: "Parentheses" },
      { keys: ["Enter"], label: "Evaluate" },
      { keys: ["Backspace"], label: "Delete last character" },
    ],
  },
  {
    title: "Appearance",
    items: [
      { keys: ["t"], label: "Toggle light / dark theme" },
      { keys: ["a"], label: "Cycle accent color" },
    ],
  },
];

export function ShortcutsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const accent = useAccent();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", accent.solid)}>
              <Keyboard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-400">Work faster without touching the mouse.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className={cn("mb-3 text-xs font-semibold uppercase tracking-widest", accent.text)}>
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.items.map((it) => (
                  <li key={it.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-300">{it.label}</span>
                    <span className="flex shrink-0 gap-1">
                      {it.keys.map((k) => (
                        <kbd
                          key={k}
                          className="rounded border border-slate-600 bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-200"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-xl bg-slate-800/60 p-3 text-center text-xs text-slate-400">
          Tip: press <kbd className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono">?</kbd> anytime to reopen this panel.
        </p>
      </div>
    </div>
  );
}