import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

/* ------------------------------------------------------------------ */
/*  Graphing                                                           */
/* ------------------------------------------------------------------ */

type Fn = { id: number; expr: string; color: string };
const COLORS = ["#38bdf8", "#f472b6", "#34d399", "#fbbf24", "#a78bfa"];

function compile(expr: string): ((x: number) => number) | null {
  const cleaned = expr
    .replace(/\s+/g, "")
    .replace(/\^/g, "**")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/\)(\d|[a-zA-Z(])/g, ")*$1");
  if (!/^[0-9xX+\-*/().]*$/.test(cleaned.replace(/\*\*/g, ""))) return null;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `with (Math) { return ${cleaned}; }`) as (x: number) => number;
    const test = fn(1);
    if (typeof test !== "number") return null;
    return fn;
  } catch {
    return null;
  }
}

export function GraphPanel() {
  const accent = useAccent();
  const [fns, setFns] = useState<Fn[]>([
    { id: 1, expr: "x^2 - 3", color: COLORS[0] },
    { id: 2, expr: "2x + 1", color: COLORS[1] },
  ]);
  const [range, setRange] = useState(10);

  const W = 640;
  const H = 480;
  const step = range <= 5 ? 1 : range <= 12 ? 2 : 5;

  const toPx = (x: number) => (x / range) * (W / 2) + W / 2;
  const toPy = (y: number) => H / 2 - (y / range) * (H / 2);

  const paths = useMemo(() => {
    return fns.map((f) => {
      const fn = compile(f.expr);
      if (!fn) return { ...f, d: "", ok: false };
      let d = "";
      let started = false;
      const samples = 600;
      for (let i = 0; i <= samples; i++) {
        const x = -range + (i / samples) * range * 2;
        const y = fn(x);
        if (!isFinite(y) || Math.abs(y) > range * 4) {
          started = false;
          continue;
        }
        const px = toPx(x);
        const py = toPy(y);
        d += `${started ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)} `;
        started = true;
      }
      return { ...f, d, ok: true };
    });
  }, [fns, range]);

  const ticks: number[] = [];
  for (let t = -range; t <= range; t += step) ticks.push(t);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Graph</CardTitle>
          <CardDescription>Numbered axes with gridlines — window ±{range}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
              {ticks.map((t) => (
                <g key={`g${t}`}>
                  <line x1={toPx(t)} y1={0} x2={toPx(t)} y2={H} stroke="#1e293b" strokeWidth={1} />
                  <line x1={0} y1={toPy(t)} x2={W} y2={toPy(t)} stroke="#1e293b" strokeWidth={1} />
                </g>
              ))}

              <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#94a3b8" strokeWidth={2} />
              <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#94a3b8" strokeWidth={2} />

              {ticks.map((t) =>
                t !== 0 ? (
                  <g key={`t${t}`}>
                    <line x1={toPx(t)} y1={H / 2 - 5} x2={toPx(t)} y2={H / 2 + 5} stroke="#94a3b8" strokeWidth={1.5} />
                    <text x={toPx(t)} y={H / 2 + 18} fill="#cbd5e1" fontSize={11} textAnchor="middle">
                      {t}
                    </text>
                    <line x1={W / 2 - 5} y1={toPy(t)} x2={W / 2 + 5} y2={toPy(t)} stroke="#94a3b8" strokeWidth={1.5} />
                    <text x={W / 2 - 9} y={toPy(t) + 4} fill="#cbd5e1" fontSize={11} textAnchor="end">
                      {t}
                    </text>
                  </g>
                ) : null
              )}

              <text x={W / 2 - 9} y={H / 2 + 18} fill="#cbd5e1" fontSize={11} textAnchor="end">
                0
              </text>

              {paths.map((p) =>
                p.ok && p.d ? <path key={p.id} d={p.d} fill="none" stroke={p.color} strokeWidth={2.5} /> : null
              )}
            </svg>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Functions</CardTitle>
          <CardDescription>Use x, +, -, *, /, ^ and parentheses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fns.map((f, i) => (
            <div key={f.id} className="space-y-1">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: f.color }} />
                f{i + 1}(x)
              </Label>
              <Input
                value={f.expr}
                onChange={(e) => setFns((prev) => prev.map((p) => (p.id === f.id ? { ...p, expr: e.target.value } : p)))}
                placeholder="e.g. x^2 - 3"
                className="font-mono"
              />
            </div>
          ))}

          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Window (±)</Label>
            <Input
              type="number"
              value={range}
              min={2}
              max={50}
              onChange={(e) => setRange(Math.max(2, Math.min(50, Number(e.target.value) || 10)))}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                setFns((prev) => [...prev, { id: Date.now(), expr: "x", color: COLORS[prev.length % COLORS.length] }])
              }
              disabled={fns.length >= 5}
            >
              Add function
            </Button>
            <Button
              variant="outline"
              onClick={() => setFns((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))}
              disabled={fns.length <= 1}
            >
              Remove
            </Button>
          </div>

          <div className={cn("rounded-xl border p-3 text-xs", accent.ring, accent.tint)}>
            <p className="font-semibold text-white">Tips</p>
            <ul className="mt-1 space-y-1 text-slate-300">
              <li>• Implicit multiplication works: <span className="font-mono">2x</span> → 2·x</li>
              <li>• Powers: <span className="font-mono">x^2</span>, roots: <span className="font-mono">sqrt(x)</span></li>
              <li>• Trig: <span className="font-mono">sin(x)</span>, <span className="font-mono">cos(x)</span>, <span className="font-mono">tan(x)</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Radicals                                                           */
/* ------------------------------------------------------------------ */

export function RadicalPanel() {
  const [value, setValue] = useState("72");
  const n = Number(value) || 0;
  const result = useMemo(() => {
    if (n < 0) return { text: "Negative radicand — result is imaginary." };
    let outside = 1;
    let inside = n;
    for (let i = 2; i * i <= inside; i++) {
      while (inside % (i * i) === 0) {
        outside *= i;
        inside /= i * i;
      }
    }
    return { text: inside === 1 ? `${outside}` : `${outside}√${inside}` };
  }, [n]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Simplify Radicals</CardTitle>
        <CardDescription>Reduce √n to simplest radical form</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-slate-400">Radicand (n)</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-lg text-white">
          √{n} = {result.text}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Systems of equations                                               */
/* ------------------------------------------------------------------ */

export function SystemsPanel() {
  const [a1, setA1] = useState("2");
  const [b1, setB1] = useState("3");
  const [c1, setC1] = useState("12");
  const [a2, setA2] = useState("1");
  const [b2, setB2] = useState("-1");
  const [c2, setC2] = useState("1");

  const A1 = Number(a1), B1 = Number(b1), C1 = Number(c1);
  const A2 = Number(a2), B2 = Number(b2), C2 = Number(c2);
  const det = A1 * B2 - A2 * B1;

  let out = "";
  if (det === 0) out = "No unique solution (lines are parallel or identical).";
  else {
    const x = (C1 * B2 - C2 * B1) / det;
    const y = (A1 * C2 - A2 * C1) / det;
    out = `x = ${x.toFixed(4)}\ny = ${y.toFixed(4)}`;
  }

  const field = (label: string, v: string, set: (s: string) => void) => (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide text-slate-400">{label}</Label>
      <Input type="number" value={v} onChange={(e) => set(e.target.value)} />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">System of Equations</CardTitle>
          <CardDescription>Solve a₁x + b₁y = c₁ and a₂x + b₂y = c₂</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          {field("a₁", a1, setA1)}
          {field("b₁", b1, setB1)}
          {field("c₁", c1, setC1)}
          {field("a₂", a2, setA2)}
          {field("b₂", b2, setB2)}
          {field("c₂", c2, setC2)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-lg whitespace-pre-wrap text-white">
            {out}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inequalities                                                       */
/* ------------------------------------------------------------------ */

export function InequalityPanel() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("6");
  const [op, setOp] = useState(">");
  const A = Number(a) || 0;
  const B = Number(b) || 0;
  const bound = A === 0 ? NaN : (B - 0) / A;
  const flip = A < 0;
  const shownOp = flip ? (op === ">" ? "<" : op === "<" ? ">" : op === "≥" ? "≤" : "≥") : op;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Linear Inequality</CardTitle>
        <CardDescription>Solve ax {op} b for x</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">a</Label>
            <Input type="number" value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Operator</Label>
            <select
              value={op}
              onChange={(e) => setOp(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="≥">≥</option>
              <option value="≤">≤</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">b</Label>
            <Input type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-lg text-white">
          {isNaN(bound) ? "Cannot solve (a = 0)." : `x ${shownOp} ${bound.toFixed(4)}`}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Fractions                                                          */
/* ------------------------------------------------------------------ */

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function FractionPanel() {
  const [n1, setN1] = useState("1");
  const [d1, setD1] = useState("2");
  const [n2, setN2] = useState("1");
  const [d2, setD2] = useState("3");
  const [op, setOp] = useState("+");

  const N1 = Number(n1), D1 = Number(d1) || 1;
  const N2 = Number(n2), D2 = Number(d2) || 1;

  let num = 0, den = 1;
  if (op === "+") { num = N1 * D2 + N2 * D1; den = D1 * D2; }
  else if (op === "-") { num = N1 * D2 - N2 * D1; den = D1 * D2; }
  else if (op === "*") { num = N1 * N2; den = D1 * D2; }
  else { num = N1 * D2; den = D1 * N2; }

  const g = gcd(num, den) || 1;
  const sn = num / g, sd = den / g;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Fraction Calculator</CardTitle>
        <CardDescription>Add, subtract, multiply, or divide fractions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">n₁</Label>
            <Input type="number" value={n1} onChange={(e) => setN1(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">d₁</Label>
            <Input type="number" value={d1} onChange={(e) => setD1(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">op</Label>
            <select
              value={op}
              onChange={(e) => setOp(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">n₂</Label>
            <Input type="number" value={n2} onChange={(e) => setN2(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">d₂</Label>
            <Input type="number" value={d2} onChange={(e) => setD2(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-lg text-white">
          {sn}/{sd} {sd !== 1 && `≈ ${(sn / sd).toFixed(4)}`}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Sequences                                                          */
/* ------------------------------------------------------------------ */

export function SequencePanel() {
  const [a1, setA1] = useState("3");
  const [d, setD] = useState("4");
  const [n, setN] = useState("10");
  const A1 = Number(a1) || 0;
  const D = Number(d) || 0;
  const N = Math.max(1, Number(n) || 1);

  const nth = A1 + (N - 1) * D;
  const sum = (N / 2) * (2 * A1 + (N - 1) * D);
  const terms = Array.from({ length: Math.min(N, 12) }, (_, i) => A1 + i * D);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Arithmetic Sequence</CardTitle>
        <CardDescription>nth term and sum of an arithmetic series</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">First term (a₁)</Label>
            <Input type="number" value={a1} onChange={(e) => setA1(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Common diff (d)</Label>
            <Input type="number" value={d} onChange={(e) => setD(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Term (n)</Label>
            <Input type="number" value={n} onChange={(e) => setN(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-white">
          <p>aₙ = {nth}</p>
          <p>Sₙ = {sum}</p>
          <p className="mt-2 text-sm text-slate-400">First terms: {terms.join(", ")}{N > 12 ? ", …" : ""}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Triangles                                                          */
/* ------------------------------------------------------------------ */

export function TrianglePanel() {
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [c, setC] = useState("");
  const A = Number(a), B = Number(b), C = Number(c);

  let out = "Enter two sides to find the third (Pythagorean theorem).";
  if (a && b && !c) out = `Hypotenuse c = ${Math.sqrt(A * A + B * B).toFixed(4)}`;
  else if (a && c && !b) out = `Leg b = ${Math.sqrt(Math.max(0, C * C - A * A)).toFixed(4)}`;
  else if (b && c && !a) out = `Leg a = ${Math.sqrt(Math.max(0, C * C - B * B)).toFixed(4)}`;
  else if (a && b && c) out = `Area = ${(0.5 * A * B).toFixed(4)} (assuming right triangle)`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Right Triangle</CardTitle>
        <CardDescription>Leave one side blank to solve for it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Leg a</Label>
            <Input type="number" value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Leg b</Label>
            <Input type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Hypotenuse c</Label>
            <Input type="number" value={c} onChange={(e) => setC(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-lg text-white">{out}</div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Complex numbers                                                    */
/* ------------------------------------------------------------------ */

export function ComplexPanel() {
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const A = Number(a) || 0;
  const B = Number(b) || 0;
  const mod = Math.sqrt(A * A + B * B);
  const arg = (Math.atan2(B, A) * 180) / Math.PI;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Complex Numbers</CardTitle>
        <CardDescription>Modulus, argument, and conjugate of a + bi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Real (a)</Label>
            <Input type="number" value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Imaginary (b)</Label>
            <Input type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-white">
          <p>z = {A} {B >= 0 ? "+" : "−"} {Math.abs(B)}i</p>
          <p>|z| = {mod.toFixed(4)}</p>
          <p>arg(z) = {arg.toFixed(2)}°</p>
          <p>conjugate = {A} {B >= 0 ? "−" : "+"} {Math.abs(B)}i</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Similarity                                                         */
/* ------------------------------------------------------------------ */

export function SimilarityPanel() {
  const [s1, setS1] = useState("4");
  const [s2, setS2] = useState("6");
  const [t1, setT1] = useState("10");
  const S1 = Number(s1) || 1;
  const S2 = Number(s2) || 1;
  const T1 = Number(t1) || 0;
  const scale = S2 / S1;
  const t2 = T1 * scale;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Similar Figures</CardTitle>
        <CardDescription>Find a missing side using scale factor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Side A (fig 1)</Label>
            <Input type="number" value={s1} onChange={(e) => setS1(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Side A' (fig 2)</Label>
            <Input type="number" value={s2} onChange={(e) => setS2(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Side B (fig 1)</Label>
            <Input type="number" value={t1} onChange={(e) => setT1(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-white">
          <p>Scale factor = {scale.toFixed(4)}</p>
          <p>Side B' = {t2.toFixed(4)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Unit circle                                                        */
/* ------------------------------------------------------------------ */

export function UnitCirclePanel() {
  const [deg, setDeg] = useState("45");
  const D = Number(deg) || 0;
  const rad = (D * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const tan = Math.tan(rad);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Unit Circle</CardTitle>
        <CardDescription>Sine, cosine, and tangent for any angle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-slate-400">Angle (degrees)</Label>
          <Input type="number" value={deg} onChange={(e) => setDeg(e.target.value)} />
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-white">
          <p>Radians = {rad.toFixed(4)}</p>
          <p>sin = {sin.toFixed(4)}</p>
          <p>cos = {cos.toFixed(4)}</p>
          <p>tan = {Math.abs(tan) > 1e6 ? "undefined" : tan.toFixed(4)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Growth & interest                                                  */
/* ------------------------------------------------------------------ */

export function GrowthPanel() {
  const [p, setP] = useState("1000");
  const [r, setR] = useState("5");
  const [t, setT] = useState("10");
  const P = Number(p) || 0;
  const R = (Number(r) || 0) / 100;
  const T = Number(t) || 0;
  const amount = P * Math.pow(1 + R, T);
  const simple = P * (1 + R * T);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Growth &amp; Interest</CardTitle>
        <CardDescription>Compound vs. simple interest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Principal</Label>
            <Input type="number" value={p} onChange={(e) => setP(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Rate (%)</Label>
            <Input type="number" value={r} onChange={(e) => setR(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Years</Label>
            <Input type="number" value={t} onChange={(e) => setT(e.target.value)} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-white">
          <p>Compound: {amount.toFixed(2)}</p>
          <p>Simple: {simple.toFixed(2)}</p>
          <p className="text-slate-400">Difference: {(amount - simple).toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}