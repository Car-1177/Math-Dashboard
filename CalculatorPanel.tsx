import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { onCompute?: (entry: string) => void };

const KEYS = [
  ["7", "8", "9", "/", "sqrt"],
  ["4", "5", "6", "*", "cbrt"],
  ["1", "2", "3", "-", "^"],
  ["0", ".", "(", ")", "+"],
  ["C", "⌫", "=", "π", "e"],
];

export function CalculatorPanel({ onCompute }: Props) {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("0");
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);

  const evaluate = (raw: string): number => {
    let s = raw
      .replace(/π/g, `(${Math.PI})`)
      .replace(/(?<![a-z])e(?![a-z])/g, `(${Math.E})`)
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/cbrt\(/g, "Math.cbrt(")
      .replace(/\^/g, "**");
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${s});`)() as number;
  };

  const press = (key: string) => {
    if (key === "C") {
      setExpr("");
      setResult("0");
      return;
    }
    if (key === "⌫") {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (key === "=") {
      try {
        const val = evaluate(expr || "0");
        const out = Number.isFinite(val) ? String(Number(val.toFixed(10))) : "Error";
        setResult(out);
        const entry = `${expr} = ${out}`;
        setHistory((h) => [entry, ...h].slice(0, 8));
        onCompute?.(entry);
      } catch {
        setResult("Error");
      }
      return;
    }
    if (key === "sqrt") {
      setExpr((e) => e + "sqrt(");
      return;
    }
    if (key === "cbrt") {
      setExpr((e) => e + "cbrt(");
      return;
    }
    setExpr((e) => e + key);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Scientific Calculator</CardTitle>
          <CardDescription>Supports + − × ÷, exponents, square &amp; cube roots, π and e.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-blue-800/40">
            <p className="min-h-6 break-all font-mono text-sm text-blue-300">{expr || "\u00A0"}</p>
            <p className="mt-2 break-all text-right font-mono text-3xl font-bold text-white">{result}</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {KEYS.flat().map((k) => (
              <button
                key={k}
                onClick={() => press(k)}
                className={cn(
                  "rounded-lg py-3 font-mono text-lg font-semibold transition-colors",
                  k === "="
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : k === "C"
                      ? "bg-red-600/80 text-white hover:bg-red-500"
                      : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                )}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setMemory(Number(result) || 0)}>
              M+ ({memory})
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpr((e) => e + String(memory))}>
              MR
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMemory(0)}>
              MC
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">History</CardTitle>
          <CardDescription>Your last calculations.</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              No calculations yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((h, i) => (
                <li key={i} className="rounded-lg bg-slate-800/60 px-3 py-2 font-mono text-sm text-blue-200">
                  {h}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}