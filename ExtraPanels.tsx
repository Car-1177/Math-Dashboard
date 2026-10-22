import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(4);
}

/* ================= TRIG SOLVER ================= */
export function TrigPanel() {
  const accent = useAccent();
  const [deg, setDeg] = useState("45");
  const D = Number(deg) || 0;
  const rad = (D * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const tan = Math.tan(rad);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Trigonometry</CardTitle>
          <CardDescription>Sine, cosine, tangent for any angle.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Angle (degrees)</Label>
            <Input value={deg} onChange={(e) => setDeg(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 30, 45, 60, 90, 180, 270].map((a) => (
              <Button key={a} variant="outline" size="sm" onClick={() => setDeg(String(a))}>
                {a}°
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Radians", fmt(rad)],
              ["sin θ", fmt(sin)],
              ["cos θ", fmt(cos)],
              ["tan θ", Math.abs(tan) > 1e6 ? "undefined" : fmt(tan)],
              ["csc θ", Math.abs(sin) < 1e-12 ? "undefined" : fmt(1 / sin)],
              ["sec θ", Math.abs(cos) < 1e-12 ? "undefined" : fmt(1 / cos)],
            ].map(([l, v], i) => (
              <div key={l} className={cn("rounded-xl border p-3", i < 3 ? cn(accent.ring, accent.tint) : "border-slate-700 bg-slate-800/50")}>
                <p className="text-xs uppercase tracking-wide text-slate-400">{l}</p>
                <p className="mt-1 font-mono text-lg font-semibold text-white">{v}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= PERCENT & PROPORTION ================= */
export function PercentPanel() {
  const accent = useAccent();
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("80");
  const A = Number(a) || 0;
  const B = Number(b) || 0;

  let label = "", value = "";
  if (mode === "of") { label = `${A}% of ${B}`; value = fmt((A / 100) * B); }
  else if (mode === "is") { label = `${A} is what % of ${B}`; value = B === 0 ? "—" : fmt((A / B) * 100) + "%"; }
  else if (mode === "change") { label = `Change from ${A} to ${B}`; value = A === 0 ? "—" : fmt(((B - A) / A) * 100) + "%"; }
  else { label = `${A}% of what is ${B}`; value = A === 0 ? "—" : fmt((B / A) * 100); }

  const modes = [
    { id: "of", label: "X% of Y" },
    { id: "is", label: "X is what % of Y" },
    { id: "change", label: "Percent change" },
    { id: "what", label: "X% of what is Y" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Percent &amp; Proportion</CardTitle>
          <CardDescription>Four common percent problem types.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  mode === m.id ? cn("text-white", accent.ring, accent.solid) : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Value A</Label><Input value={a} onChange={(e) => setA(e.target.value)} /></div>
            <div className="space-y-2"><Label>Value B</Label><Input value={b} onChange={(e) => setB(e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("rounded-xl border p-6", accent.ring, accent.tint)}>
            <p className={cn("text-xs uppercase tracking-wide", accent.text)}>{label}</p>
            <p className="mt-1 font-mono text-3xl font-bold text-white">{value}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= LOG & EXPONENT ================= */
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
          <div className="flex gap-2">
            {[{ id: "log", label: "log_b(x)" }, { id: "exp", label: "b^x" }].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
                  mode === m.id ? cn("text-white", accent.ring, accent.solid) : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                )}
              >
                {m.label}
              </button>
            ))}
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

/* ================= CIRCLE & CONIC ================= */
export function ConicPanel() {
  const accent = useAccent();
  const [h, setH] = useState("2");
  const [k, setK] = useState("-3");
  const [r, setR] = useState("5");
  const H = parseFloat(h), K = parseFloat(k), R = parseFloat(r);
  const valid = !isNaN(H) && !isNaN(K) && !isNaN(R) && R > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Circle &amp; Conic Analyzer</CardTitle>
          <CardDescription>Standard form from center and radius.</CardDescription>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= PROBABILITY ================= */
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
  const N = parseInt(n, 10), R = parseInt(r, 10);
  const fav = parseFloat(favorable), tot = parseFloat(total);
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
            {[["nPr", isNaN(N) || isNaN(R) ? "—" : String(nPr(N, R))], ["nCr", isNaN(N) || isNaN(R) ? "—" : String(nCr(N, R))], ["n!", isNaN(N) ? "—" : String(factorial(N))]].map(([l, v], i) => (
              <div key={l} className={cn("rounded-xl border p-4", i < 2 ? cn(accent.ring, accent.tint) : "border-slate-700 bg-slate-800/50")}>
                <p className={cn("text-xs uppercase tracking-wide", i < 2 ? accent.text : "text-slate-400")}>{l}</p>
                <p className="mt-1 font-mono text-xl font-bold text-white">{v}</p>
              </div>
            ))}
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
            <div className="space-y-2"><Label>Favorable</Label><Input value={favorable} onChange={(e) => setFavorable(e.target.value)} /></div>
            <div className="space-y-2"><Label>Total</Label><Input value={total} onChange={(e) => setTotal(e.target.value)} /></div>
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

/* ================= UNIT CONVERTER ================= */
const CONVERSIONS: Record<string, Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  mass: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  volume: { L: 1, mL: 0.001, gal: 3.78541, qt: 0.946353, cup: 0.236588, floz: 0.0295735 },
  area: { "m²": 1, "km²": 1000000, "cm²": 0.0001, "ft²": 0.092903, "in²": 0.00064516, acre: 4046.86 },
};

export function ConverterPanel() {
  const accent = useAccent();
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState("1");
  const units = Object.keys(CONVERSIONS[category]);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    return (v * CONVERSIONS[category][from]) / CONVERSIONS[category][to];
  }, [category, from, to, value]);

  const changeCategory = (c: string) => {
    setCategory(c);
    const u = Object.keys(CONVERSIONS[c]);
    setFrom(u[0]);
    setTo(u[1]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Unit Converter</CardTitle>
          <CardDescription>Length, mass, volume, area.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <select value={category} onChange={(e) => changeCategory(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
              {Object.keys(CONVERSIONS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Value</Label><Input value={value} onChange={(e) => setValue(e.target.value)} /></div>
          <div className="grid grid-cols-3 items-end gap-3">
            <div className="space-y-2">
              <Label>From</Label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button
              onClick={() => { setFrom(to); setTo(from); }}
              className={cn("rounded-lg px-3 py-2 text-sm font-semibold text-white", accent.solid)}
              title="Swap units"
            >
              ⇄
            </button>
            <div className="space-y-2">
              <Label>To</Label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Result</CardTitle>
        </CardHeader>
        <CardContent>
          {result === null ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">Enter a valid number.</div>
          ) : (
            <div className={cn("rounded-xl border p-6", accent.ring, accent.tint)}>
              <p className={cn("text-xs uppercase tracking-wide", accent.text)}>{value} {from} =</p>
              <p className="mt-1 font-mono text-4xl font-bold text-white">{Number.isInteger(result) ? result : result.toFixed(6)}</p>
              <p className="mt-1 text-sm text-slate-300">{to}</p>
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