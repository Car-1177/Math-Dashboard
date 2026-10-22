import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

/* ================= MATRIX CALCULATOR ================= */
type Matrix = number[][];

function parseMatrix(text: string): Matrix | null {
  const rows = text
    .trim()
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => r.split(/[\s,]+/).map((x) => parseFloat(x)));
  if (rows.length === 0) return null;
  const cols = rows[0].length;
  if (cols === 0 || rows.some((r) => r.length !== cols || r.some((v) => isNaN(v)))) return null;
  return rows;
}

function det(m: Matrix): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let d = 0;
  for (let c = 0; c < n; c++) {
    const minor = m.slice(1).map((row) => row.filter((_, j) => j !== c));
    d += (c % 2 === 0 ? 1 : -1) * m[0][c] * det(minor);
  }
  return d;
}

function matMul(a: Matrix, b: Matrix): Matrix | null {
  if (a[0].length !== b.length) return null;
  const out: Matrix = [];
  for (let i = 0; i < a.length; i++) {
    out[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let s = 0;
      for (let k = 0; k < b.length; k++) s += a[i][k] * b[k][j];
      out[i][j] = s;
    }
  }
  return out;
}

function matAdd(a: Matrix, b: Matrix, sign = 1): Matrix | null {
  if (a.length !== b.length || a[0].length !== b[0].length) return null;
  return a.map((row, i) => row.map((v, j) => v + sign * b[i][j]));
}

function transpose(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => row[j]));
}

function fmt(m: Matrix): string {
  return m.map((r) => r.map((v) => (Number.isInteger(v) ? v : v.toFixed(4))).join("  ")).join("\n");
}

export function MatrixPanel() {
  const accent = useAccent();
  const [a, setA] = useState("1 2\n3 4");
  const [b, setB] = useState("5 6\n7 8");
  const [op, setOp] = useState("add");

  const result = useMemo(() => {
    const ma = parseMatrix(a);
    const mb = parseMatrix(b);
    if (!ma) return { error: "Matrix A is invalid. Use rows of space-separated numbers." };
    if (op === "det") return { label: "det(A)", value: det(ma).toString() };
    if (op === "transpose") return { label: "Aᵀ", value: fmt(transpose(ma)) };
    if (!mb) return { error: "Matrix B is invalid." };
    if (op === "add") {
      const r = matAdd(ma, mb);
      return r ? { label: "A + B", value: fmt(r) } : { error: "Dimensions must match for addition." };
    }
    if (op === "sub") {
      const r = matAdd(ma, mb, -1);
      return r ? { label: "A − B", value: fmt(r) } : { error: "Dimensions must match for subtraction." };
    }
    if (op === "mul") {
      const r = matMul(ma, mb);
      return r ? { label: "A × B", value: fmt(r) } : { error: "Columns of A must equal rows of B." };
    }
    return { error: "Unknown operation." };
  }, [a, b, op]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Matrix Calculator</CardTitle>
          <CardDescription>One row per line, values separated by spaces or commas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Matrix A</Label>
              <textarea
                value={a}
                onChange={(e) => setA(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Matrix B</Label>
              <textarea
                value={b}
                onChange={(e) => setB(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Operation</Label>
            <select value={op} onChange={(e) => setOp(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
              <option value="add">A + B</option>
              <option value="sub">A − B</option>
              <option value="mul">A × B</option>
              <option value="det">det(A)</option>
              <option value="transpose">Transpose A</option>
            </select>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Result</CardTitle>
        </CardHeader>
        <CardContent>
          {"error" in result ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">{result.error}</div>
          ) : (
            <div className={cn("rounded-xl border p-4", accent.ring, accent.tint)}>
              <p className={cn("text-xs uppercase tracking-wide", accent.text)}>{result.label}</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-lg text-white">{result.value}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= PROBABILITY & COMBINATORICS ================= */
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}
function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

export function ProbabilityPanel() {
  const accent = useAccent();
  const [n, setN] = useState("5");
  const [r, setR] = useState("2");
  const [favorable, setFavorable] = useState("3");
  const [total, setTotal] = useState("10");

  const N = parseInt(n, 10);
  const R = parseInt(r, 10);
  const fav = parseFloat(favorable);
  const tot = parseFloat(total);

  const prob = !isNaN(fav) && !isNaN(tot) && tot > 0 ? fav / tot : null;
  const odds = prob !== null && prob < 1 ? prob / (1 - prob) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Combinatorics</CardTitle>
          <CardDescription>Permutations, combinations, factorials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>n</Label><Input value={n} onChange={(e) => setN(e.target.value)} /></div>
            <div className="space-y-2"><Label>r</Label><Input value={r} onChange={(e) => setR(e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className={cn("rounded-xl border p-4", accent.ring, accent.tint)}>
              <p className={cn("text-xs uppercase tracking-wide", accent.text)}>nPr</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">{isNaN(N) || isNaN(R) ? "—" : nPr(N, R)}</p>
            </div>
            <div className={cn("rounded-xl border p-4", accent.ring, accent.tint)}>
              <p className={cn("text-xs uppercase tracking-wide", accent.text)}>nCr</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">{isNaN(N) || isNaN(R) ? "—" : nCr(N, R)}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">n!</p>
              <p className="mt-1 font-mono text-xl text-white">{isNaN(N) ? "—" : factorial(N)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Probability &amp; Odds</CardTitle>
          <CardDescription>P(event) and odds in favor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Favorable outcomes</Label><Input value={favorable} onChange={(e) => setFavorable(e.target.value)} /></div>
            <div className="space-y-2"><Label>Total outcomes</Label><Input value={total} onChange={(e) => setTotal(e.target.value)} /></div>
          </div>
          {prob === null ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">Enter valid numbers (total &gt; 0).</div>
          ) : (
            <div className="space-y-3">
              <div className={cn("rounded-xl border p-4", accent.ring, accent.tint)}>
                <p className={cn("text-xs uppercase tracking-wide", accent.text)}>P(event)</p>
                <p className="mt-1 font-mono text-2xl font-bold text-white">{(prob * 100).toFixed(2)}%</p>
                <p className="mt-1 text-xs text-slate-300">≈ {prob.toFixed(4)}</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Odds in favor</p>
                <p className="mt-1 font-mono text-lg text-white">{odds === null ? "—" : `${odds.toFixed(3)} : 1`}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= LOG & EXPONENT SOLVER ================= */
export function LogPanel() {
  const accent = useAccent();
  const [base, setBase] = useState("2");
  const [arg, setArg] = useState("8");
  const [mode, setMode] = useState("log");

  const b = parseFloat(base);
  const x = parseFloat(arg);

  const result = useMemo(() => {
    if (isNaN(b) || isNaN(x) || b <= 0 || b === 1) return { error: "Base must be positive and ≠ 1." };
    if (mode === "log") {
      if (x <= 0) return { error: "Argument of a log must be positive." };
      return { label: `log_${b}(${x})`, value: (Math.log(x) / Math.log(b)).toFixed(6) };
    }
    return { label: `${b}^${x}`, value: Math.pow(b, x).toFixed(6) };
  }, [b, x, mode]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Logarithm &amp; Exponent Solver</CardTitle>
          <CardDescription>Evaluate logs in any base or compute powers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="flex gap-2">
              {[
                { id: "log", label: "log_b(x)" },
                { id: "exp", label: "b^x" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
                    mode === m.id
                      ? cn("text-white", accent.ring, accent.solid)
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Base b</Label><Input value={base} onChange={(e) => setBase(e.target.value)} /></div>
            <div className="space-y-2"><Label>{mode === "log" ? "Argument x" : "Exponent x"}</Label><Input value={arg} onChange={(e) => setArg(e.target.value)} /></div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Identities</p>
            <p className="mt-1 font-mono">log_b(xy) = log_b x + log_b y</p>
            <p className="font-mono">log_b(x/y) = log_b x − log_b y</p>
            <p className="font-mono">log_b(xⁿ) = n · log_b x</p>
            <p className="font-mono">log_b(x) = ln x / ln b</p>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Result</CardTitle>
        </CardHeader>
        <CardContent>
          {"error" in result ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">{result.error}</div>
          ) : (
            <div className={cn("rounded-xl border p-6", accent.ring, accent.tint)}>
              <p className={cn("text-xs uppercase tracking-wide", accent.text)}>{result.label}</p>
              <p className="mt-1 font-mono text-3xl font-bold text-white">{result.value}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= CIRCLE & CONIC ANALYZER ================= */
export function ConicPanel() {
  const accent = useAccent();
  const [h, setH] = useState("2");
  const [k, setK] = useState("-3");
  const [r, setR] = useState("5");

  const H = parseFloat(h);
  const K = parseFloat(k);
  const R = parseFloat(r);

  const valid = !isNaN(H) && !isNaN(K) && !isNaN(R) && R > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Circle &amp; Conic Analyzer</CardTitle>
          <CardDescription>Standard form of a circle from center and radius.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2"><Label>Center h</Label><Input value={h} onChange={(e) => setH(e.target.value)} /></div>
            <div className="space-y-2"><Label>Center k</Label><Input value={k} onChange={(e) => setK(e.target.value)} /></div>
            <div className="space-y-2"><Label>Radius r</Label><Input value={r} onChange={(e) => setR(e.target.value)} /></div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Standard forms</p>
            <p className="mt-1 font-mono">Circle: (x−h)² + (y−k)² = r²</p>
            <p className="font-mono">Parabola: y = a(x−h)² + k</p>
            <p className="font-mono">Ellipse: (x−h)²/a² + (y−k)²/b² = 1</p>
            <p className="font-mono">Hyperbola: (x−h)²/a² − (y−k)²/b² = 1</p>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {!valid ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">Radius must be positive.</div>
          ) : (
            <div className="space-y-3">
              <div className={cn("rounded-xl border p-4", accent.ring, accent.tint)}>
                <p className={cn("text-xs uppercase tracking-wide", accent.text)}>Equation</p>
                <p className="mt-1 font-mono text-sm text-white">
                  (x {H >= 0 ? "−" : "+"} {Math.abs(H)})² + (y {K >= 0 ? "−" : "+"} {Math.abs(K)})² = {(R * R).toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Area</p>
                  <p className="mt-1 font-mono text-lg text-white">{(Math.PI * R * R).toFixed(4)}</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Circumference</p>
                  <p className="mt-1 font-mono text-lg text-white">{(2 * Math.PI * R).toFixed(4)}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Diameter</p>
                <p className="mt-1 font-mono text-lg text-white">{(2 * R).toFixed(4)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= WORD PROBLEM TRANSLATOR ================= */
type Pattern = { match: RegExp; build: (m: RegExpMatchArray) => string };

const PATTERNS: Pattern[] = [
  { match: /sum of (\d+) and (\d+)/i, build: (m) => `${m[1]} + ${m[2]} = ${Number(m[1]) + Number(m[2])}` },
  { match: /difference (?:between|of) (\d+) and (\d+)/i, build: (m) => `${m[1]} − ${m[2]} = ${Number(m[1]) - Number(m[2])}` },
  { match: /product of (\d+) and (\d+)/i, build: (m) => `${m[1]} × ${m[2]} = ${Number(m[1]) * Number(m[2])}` },
  { match: /quotient of (\d+) and (\d+)/i, build: (m) => `${m[1]} ÷ ${m[2]} = ${(Number(m[1]) / Number(m[2])).toFixed(4)}` },
  { match: /(\d+) percent of (\d+)/i, build: (m) => `${m[1]}% of ${m[2]} = ${((Number(m[1]) / 100) * Number(m[2])).toFixed(4)}` },
  { match: /(\d+) more than (\d+)/i, build: (m) => `${m[2]} + ${m[1]} = ${Number(m[1]) + Number(m[2])}` },
  { match: /(\d+) less than (\d+)/i, build: (m) => `${m[2]} − ${m[1]} = ${Number(m[2]) - Number(m[1])}` },
  { match: /(\d+) times (\d+)/i, build: (m) => `${m[1]} × ${m[2]} = ${Number(m[1]) * Number(m[2])}` },
  { match: /half of (\d+)/i, build: (m) => `${m[1]} ÷ 2 = ${(Number(m[1]) / 2).toFixed(4)}` },
  { match: /square of (\d+)/i, build: (m) => `${m[1]}² = ${Number(m[1]) ** 2}` },
  { match: /square root of (\d+)/i, build: (m) => `√${m[1]} = ${Math.sqrt(Number(m[1])).toFixed(4)}` },
  { match: /average of ([\d,\s]+)/i, build: (m) => {
    const nums = m[1].split(",").map((x) => parseFloat(x.trim())).filter((x) => !isNaN(x));
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return `(${nums.join(" + ")}) ÷ ${nums.length} = ${avg.toFixed(4)}`;
  } },
];

export function WordProblemPanel() {
  const accent = useAccent();
  const [text, setText] = useState("What is 15 percent of 80?");
  const [steps, setSteps] = useState<string[]>([]);

  const translate = () => {
    const found: string[] = [];
    for (const p of PATTERNS) {
      const m = text.match(p.match);
      if (m) found.push(p.build(m));
    }
    setSteps(found);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Word Problem Translator</CardTitle>
          <CardDescription>Turn plain-English phrases into equations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your problem</Label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            />
          </div>
          <Button onClick={translate} className={accent.solid}>Translate</Button>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Try phrases like</p>
            <p className="mt-1">"sum of 12 and 8", "20 percent of 150", "average of 4, 8, 10", "square root of 144", "5 less than 20".</p>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Translation</CardTitle>
        </CardHeader>
        <CardContent>
          {steps.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              Enter a phrase and press Translate.
            </div>
          ) : (
            <ul className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className={cn("rounded-lg px-3 py-2 font-mono text-sm", accent.tint, accent.text)}>{s}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}