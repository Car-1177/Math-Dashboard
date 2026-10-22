import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent, type Accent } from "@/components/AccentContext";
import { clearAllPersisted } from "@/lib/usePersistentState";
import { Save, Trash2, CheckCircle2 } from "lucide-react";

type SettingsProps = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
  history: string[];
  clearHistory: () => void;
  sidebarPinned: boolean;
  setSidebarPinned: (v: boolean) => void;
};

export function SettingsPanel({
  theme,
  setTheme,
  accent,
  setAccent,
  history,
  clearHistory,
  sidebarPinned,
  setSidebarPinned,
}: SettingsProps) {
  const accentTokens = useAccent();
  const [pemdas, setPemdas] = useState(true);
  const [rounding, setRounding] = useState("4");
  const [shortcuts, setShortcuts] = useState(false);
  const [saved, setSaved] = useState(false);

  const accentOptions: { id: Accent; label: string; swatch: string }[] = [
    { id: "blue", label: "Blue", swatch: "bg-blue-600" },
    { id: "cyan", label: "Cyan", swatch: "bg-cyan-600" },
    { id: "indigo", label: "Indigo", swatch: "bg-indigo-600" },
    { id: "emerald", label: "Emerald", swatch: "bg-emerald-600" },
  ];

  const handleReset = () => {
    clearAllPersisted();
    setSaved(true);
    window.setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Appearance</CardTitle>
          <CardDescription>Theme and accent color.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors",
                    theme === t
                      ? cn("text-white", accentTokens.ring, accentTokens.solid)
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent color</Label>
            <div className="flex gap-2">
              {accentOptions.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                    accent === a.id
                      ? cn("text-white", accentTokens.ring, accentTokens.solid)
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                  )}
                >
                  <span className={cn("h-3 w-3 rounded-full", a.swatch)} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Layout</CardTitle>
          <CardDescription>Control how the sidebar behaves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="pr-3">
              <p className="text-sm font-semibold text-white">Pin sidebar</p>
              <p className="text-xs text-slate-400">
                {sidebarPinned
                  ? "Always visible — the sidebar never hides."
                  : "Collapsible — toggle it with the menu button."}
              </p>
            </div>
            <button
              onClick={() => setSidebarPinned(!sidebarPinned)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                sidebarPinned ? accentTokens.toggle : "bg-slate-600"
              )}
              aria-label="Toggle pinned sidebar"
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                  sidebarPinned ? "left-5" : "left-0.5"
                )}
              />
            </button>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Tip</p>
            <p className="mt-1">
              With the sidebar pinned, the menu button is hidden and every tool stays one click away.
              Unpin it if you want more room for wide panels like the graphing calculator.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Calculation</CardTitle>
          <CardDescription>PEMDAS and rounding preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div>
              <p className="text-sm font-semibold text-white">Strict PEMDAS</p>
              <p className="text-xs text-slate-400">Evaluate parentheses, exponents, ×÷, then +−.</p>
            </div>
            <button
              onClick={() => setPemdas((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                pemdas ? accentTokens.toggle : "bg-slate-600"
              )}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", pemdas ? "left-5" : "left-0.5")} />
            </button>
          </div>
          <div className="space-y-2">
            <Label>Decimal places</Label>
            <Input value={rounding} onChange={(e) => setRounding(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div>
              <p className="text-sm font-semibold text-white">Keyboard shortcuts</p>
              <p className="text-xs text-slate-400">Show shortcut hints on panels.</p>
            </div>
            <button
              onClick={() => setShortcuts((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                shortcuts ? accentTokens.toggle : "bg-slate-600"
              )}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", shortcuts ? "left-5" : "left-0.5")} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Saved Data</CardTitle>
          <CardDescription>Everything is stored in your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("flex items-start gap-3 rounded-xl border p-4", accentTokens.ring, accentTokens.tint)}>
            <Save className={cn("mt-0.5 h-5 w-5 shrink-0", accentTokens.text)} />
            <div className="text-sm">
              <p className="font-semibold text-white">Auto-save is on</p>
              <p className="mt-1 text-slate-300">
                Your tab, theme, accent, history, streak, community posts, planner tasks and practice
                progress are saved automatically and restored when you come back — even after closing the browser.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">Activity history ({history.length})</p>
            {history.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
                No activity yet. Use the calculator or practice tests.
              </div>
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto">
                {history.map((h, i) => (
                  <li key={i} className={cn("rounded-lg px-3 py-2 font-mono text-sm", accentTokens.tint, accentTokens.text)}>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {history.length > 0 && (
              <Button variant="outline" onClick={clearHistory}>Clear history</Button>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
            <div className="pr-3">
              <p className="text-sm font-semibold text-white">Reset everything</p>
              <p className="text-xs text-rose-200/80">
                Erase all saved data and restore the app to its defaults.
              </p>
            </div>
            <Button
              onClick={handleReset}
              className="shrink-0 gap-2 border-transparent bg-rose-600 text-white hover:bg-rose-500"
            >
              {saved ? <CheckCircle2 className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              {saved ? "Resetting…" : "Reset"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}