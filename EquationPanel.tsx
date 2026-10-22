import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Step = { text: string };

function solveLinear(input: string): { steps: Step[]; answer: string } | null {
  // Handles forms like "5x/10 = 15/5" or "3x + 4 = 19" or "2x - 5 = x + 3"
  const cleaned = input.replace(/\s+/g, "");
  const [lhs, rhs] = cleaned.split("=");
  if (!lhs || !rhs) return null;

  const parseSide = (s: string): { a: number; b: number } => {
    // split into terms
    const terms = s.replace(/-/g, "+-").split("+").filter(Boolean);
    let a = 0;
    let b = 0;
    for (const t of terms) {
      if (t.includes("x")) {
        const coefStr = t.replace("x", "");
        let coef: number;
        if (coefStr === "" || coefStr === "+") coef = 1;
        else if (coefStr === "-") coef = -1;
        else if (coefStr.includes("/")) {
          const [n, d] = coefStr.split("/");
          coef = parseFloat(n) / parseFloat(d);
        } else coef = parseFloat(coefStr);
        a += coef;
      } else if (t.includes("/")) {
        const [n, d] = t.split("/");
        b += parseFloat(n) / parseFloat(d);
      } else {
        b += parseFloat(t);
      }
    }
    return { a, b };
  };

  const L = parseSide(lhs);
  const R = parseSide(rhs);
  const a = L.a - R.a;
  const b = R.b - L.b;
  if (a === 0) return null;
  const x = b / a;

  const steps: Step[] = [
    { text: `Original: ${input}` },
    { text: `Move x-terms to left: ${a}x = ${b}` },
    { text: `Divide both sides by ${a}` },
    { text: `x = ${Number.isInteger(x) ? x : x.toFixed(4)}` },
  ];
  return { steps, answer: Number.isInteger(x) ? String(x) : x.toFixed(4) };
}

export function EquationPanel() {
  const [input, setInput] = useState("5x/10 = 15/5");
  const result = useMemo(() => solveLinear(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Step-by-Step Solver</CardTitle>
          <CardDescription>Linear equations with fractions, e.g. 5x/10 = 15/5</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eq-input">Equation</Label>
            <Input id="eq-input" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput("5x/10 = 15/5")}>
              5x/10 = 15/5
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("3x + 4 = 19")}>
              3x + 4 = 19
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("2x - 5 = x + 3")}>
              2x - 5 = x + 3
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Solution Steps</CardTitle>
          <CardDescription>Every step shown so you can follow along.</CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
              Could not solve. Try a linear form like 3x + 4 = 19.
            </div>
          ) : (
            <div className="space-y-3">
              {result.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="font-mono text-sm text-slate-100">{s.text}</p>
                </div>
              ))}
              <div className="rounded-xl bg-blue-600/20 p-4 ring-1 ring-blue-500/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Answer</p>
                <p className="mt-1 font-mono text-2xl font-bold text-white">x = {result.answer}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}