import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Term = { coef: number; exp: number };

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function parsePolynomial(text: string): Term[] | null {
  const cleaned = text.replace(/\s+/g, "").replace(/-/g, "+-");
  const parts = cleaned.split("+").filter((p) => p.length > 0);
  const map = new Map<number, number>();
  for (const part of parts) {
    const m = part.match(/^([+-]?\d*\.?\d*)(x(?:\^(\d+))?)?$/);
    if (!m) return null;
    const coefStr = m[1];
    let coef: number;
    if (coefStr === "" || coefStr === "+") coef = 1;
    else if (coefStr === "-") coef = -1;
    else coef = parseFloat(coefStr);
    if (isNaN(coef)) return null;
    let exp = 0;
    if (m[2]) exp = m[3] ? parseInt(m[3], 10) : 1;
    map.set(exp, (map.get(exp) ?? 0) + coef);
  }
  const terms: Term[] = [];
  map.forEach((coef, exp) => {
    if (coef !== 0) terms.push({ coef, exp });
  });
  terms.sort((a, b) => b.exp - a.exp);
  return terms.length ? terms : null;
}

function formatTerm(t: Term, first: boolean): string {
  const sign = t.coef < 0 ? "−" : first ? "" : "+";
  const abs = Math.abs(t.coef);
  const coefPart = abs === 1 && t.exp > 0 ? "" : String(abs);
  const varPart = t.exp === 0 ? "" : t.exp === 1 ? "x" : `x^${t.exp}`;
  return `${sign}${sign && !first ? " " : ""}${coefPart}${varPart}`.trim();
}

function formatPoly(terms: Term[]): string {
  if (!terms.length) return "0";
  return terms.map((t, i) => formatTerm(t, i === 0)).join(" ");
}

function evalPoly(terms: Term[], x: number): number {
  return terms.reduce((sum, t) => sum + t.coef * Math.pow(x, t.exp), 0);
}

function factorQuadratic(terms: Term[]): string | null {
  const deg2 = terms.find((t) => t.exp === 2);
  const deg1 = terms.find((t) => t.exp === 1);
  const deg0 = terms.find((t) => t.exp === 0);
  if (!deg2) return null;
  const a = deg2.coef;
  const b = deg1 ? deg1.coef : 0;
  const c = deg0 ? deg0.coef : 0;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const sqrt = Math.sqrt(disc);
  if (!Number.isInteger(sqrt)) return null;
  const r1 = (-b + sqrt) / (2 * a);
  const r2 = (-b - sqrt) / (2 * a);
  const fmtRoot = (r: number) => (Number.isInteger(r) ? String(r) : r.toFixed(3));
  if (a === 1) return `(x ${r1 >= 0 ? "−" : "+"} ${fmtRoot(Math.abs(r1))})(x ${r2 >= 0 ? "−" : "+"} ${fmtRoot(Math.abs(r2))})`;
  return `${a}(x ${r1 >= 0 ? "−" : "+"} ${fmtRoot(Math.abs(r1))})(x ${r2 >= 0 ? "−" : "+"} ${fmtRoot(Math.abs(r2))})`;
}

export function PolynomialPanel() {
  const [input, setInput] = useState("x^2 - 5x + 6");

  const parsed = useMemo(() => parsePolynomial(input), [input]);

  const analysis = useMemo(() => {
    if (!parsed) return null;
    const gcf = parsed.reduce((g, t) => gcd(g, t.coef), 0);
    const factored = factorQuadratic(parsed);
    const degree = parsed[0].exp;
    const leading = parsed[0].coef;
    const constant = parsed.find((t) => t.exp === 0)?.coef ?? 0;
    const roots = parsed
      .filter((t) => t.exp === 1 && parsed.length === 2)
      .map((t) => -constant / t.coef);
    return { gcf, factored, degree, leading, constant, roots };
  }, [parsed]);

  const samples = [-2, -1, 0, 1, 2];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Polynomial Input</CardTitle>
          <CardDescription>
            Use ^ for powers, e.g. <span className="font-mono">2x^3 - 4x^2 + x - 7</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poly-input">Expression</Label>
            <Input
              id="poly-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="x^2 - 5x + 6"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput("x^2 - 5x + 6")}>
              x² − 5x + 6
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("2x^2 + 7x + 3")}>
              2x² + 7x + 3
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("x^3 - 6x^2 + 11x - 6")}>
              Cubic
            </Button>
          </div>
          {parsed && (
            <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                Standard form
              </p>
              <p className="mt-1 font-mono text-lg text-teal-900">{formatPoly(parsed)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Factoring &amp; Properties</CardTitle>
          <CardDescription>Greatest common factor, factored form, and evaluation.</CardDescription>
        </CardHeader>
        <CardContent>
          {!parsed ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Could not parse that expression. Try a form like <span className="font-mono">3x^2 - 12</span>.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Degree" value={String(analysis!.degree)} accent />
                <Stat label="Leading coeff" value={String(analysis!.leading)} />
                <Stat label="Constant term" value={String(analysis!.constant)} />
                <Stat label="GCF of coeffs" value={String(analysis!.gcf)} />
                <Stat label="Terms" value={String(parsed.length)} />
                <Stat
                  label="Linear root"
                  value={analysis!.roots.length ? analysis!.roots.map((r) => r.toFixed(3)).join(", ") : "—"}
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Factored form
                </p>
                <p className="mt-1 font-mono text-lg text-slate-800">
                  {analysis!.factored
                    ? analysis!.factored
                    : analysis!.gcf > 1
                      ? `${analysis!.gcf}(${formatPoly(parsed.map((t) => ({ ...t, coef: t.coef / analysis!.gcf })))})`
                      : "No simple integer factorization found"}
                </p>
              </div>

              <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  Evaluations
                </p>
                <div className="mt-2 grid grid-cols-5 gap-2 text-center">
                  {samples.map((x) => (
                    <div key={x} className="rounded-lg bg-white/70 p-2">
                      <p className="text-xs text-teal-700">x = {x}</p>
                      <p className="font-mono text-sm font-semibold text-teal-900">
                        {evalPoly(parsed, x)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        accent ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-slate-50"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={cn("mt-1 font-mono text-lg font-semibold", accent ? "text-teal-800" : "text-slate-800")}>
        {value}
      </p>
    </div>
  );
}