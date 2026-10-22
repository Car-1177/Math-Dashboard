import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(4);
}

/* ================= STATS ================= */
export function StatsPanel() {
  const [raw, setRaw] = useState("10, 20, 20, 35, 50");
  const data = useMemo(
    () => raw.split(/[,\s]+/).map((x) => parseFloat(x)).filter((x) => !isNaN(x)),
    [raw]
  );
  const stats = useMemo(() => {
    if (!data.length) return null;
    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const counts = new Map<number, number>();
    data.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
    let maxC = 0;
    counts.forEach((c) => (maxC = Math.max(maxC, c)));
    const modes: number[] = [];
    counts.forEach((c, v) => c === maxC && modes.push(v));
    const hasMode = maxC > 1 && modes.length !== n;
    const varPop = data.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const varSamp = n > 1 ? data.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1) : 0;
    return {
      n, sum, mean, median,
      modeText: hasMode ? modes.sort((a, b) => a - b).join(", ") : "No unique mode",
      min: sorted[0], max: sorted[n - 1], range: sorted[n - 1] - sorted[0],
      varPop, varSamp, sdPop: Math.sqrt(varPop), sdSamp: Math.sqrt(varSamp),
    };
  }, [data]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Descriptive Statistics</CardTitle>
          <CardDescription>Comma or space separated numbers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="10, 20, 20, 35, 50" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setRaw("2, 4, 4, 4, 5, 5, 7, 9")}>Sample</Button>
            <Button variant="ghost" size="sm" onClick={() => setRaw("")}>Clear</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              Enter numbers to see statistics.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["n", stats.n], ["Sum", stats.sum], ["Mean", stats.mean],
                ["Median", stats.median], ["Mode", stats.modeText], ["Min", stats.min],
                ["Max", stats.max], ["Range", stats.range], ["σ²", stats.varPop],
                ["s²", stats.varSamp], ["σ", stats.sdPop], ["s", stats.sdSamp],
              ].map(([label, val], i) => (
                <div key={String(label)} className={cn("rounded-xl border p-3", i < 5 ? "border-blue-500/40 bg-blue-600/10" : "border-slate-700 bg-slate-800/50")}>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white">
                    {typeof val === "number" ? fmt(val) : val}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= QUADRATIC ================= */
export function QuadraticPanel() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");
  const r = useMemo(() => {
    const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c);
    if ([A, B, C].some(isNaN)) return { error: "Enter valid numbers." };
    if (A === 0) return { error: "a cannot be 0." };
    const disc = B * B - 4 * A * C;
    const vx = -B / (2 * A);
    const vy = A * vx * vx + B * vx + C;
    let roots: string[] = [], nature = "";
    if (disc > 0) {
      nature = "Two distinct real roots";
      roots = [`x₁ = ${fmt((-B + Math.sqrt(disc)) / (2 * A))}`, `x₂ = ${fmt((-B - Math.sqrt(disc)) / (2 * A))}`];
    } else if (disc === 0) {
      nature = "One repeated real root";
      roots = [`x = ${fmt(-B / (2 * A))}`];
    } else {
      nature = "Two complex roots";
      const re = -B / (2 * A), im = Math.sqrt(-disc) / (2 * A);
      roots = [`x₁ = ${fmt(re)} + ${fmt(Math.abs(im))}i`, `x₂ = ${fmt(re)} − ${fmt(Math.abs(im))}i`];
    }
    return { disc, vx, vy, roots, nature, sum: -B / A, prod: C / A, opens: A > 0 ? "Upward" : "Downward" };
  }, [a, b, c]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">ax² + bx + c = 0</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["a", a, setA], ["b", b, setB], ["c", c, setC]].map(([lbl, val, set]) => (
              <div key={String(lbl)} className="space-y-2">
                <Label>{lbl as string}</Label>
                <Input type="number" value={val as string} onChange={(e) => (set as (s: string) => void)(e.target.value)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {"error" in r ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">{r.error}</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["Discriminant", fmt(r.disc!)],
                  ["Vertex x", fmt(r.vx!)],
                  ["Vertex y", fmt(r.vy!)],
                  ["Sum of roots", fmt(r.sum!)],
                  ["Product of roots", fmt(r.prod!)],
                  ["Opens", r.opens!],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{l}</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-blue-500/40 bg-blue-600/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">{r.nature}</p>
                <div className="mt-2 space-y-1 font-mono text-base text-white">
                  {r.roots!.map((rt) => <p key={rt}>{rt}</p>)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= POLYNOMIAL ================= */
type Term = { coef: number; exp: number };

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function parsePoly(text: string): Term[] | null {
  const cleaned = text.replace(/\s+/g, "").replace(/-/g, "+-");
  const parts = cleaned.split("+").filter(Boolean);
  const map = new Map<number, number>();
  for (const p of parts) {
    const m = p.match(/^([+-]?\d*\.?\d*)(x(?:\^(\d+))?)?$/);
    if (!m) return null;
    const cs = m[1];
    let coef = cs === "" || cs === "+" ? 1 : cs === "-" ? -1 : parseFloat(cs);
    if (isNaN(coef)) return null;
    const exp = m[2] ? (m[3] ? parseInt(m[3], 10) : 1) : 0;
    map.set(exp, (map.get(exp) ?? 0) + coef);
  }
  const terms: Term[] = [];
  map.forEach((coef, exp) => coef !== 0 && terms.push({ coef, exp }));
  terms.sort((a, b) => b.exp - a.exp);
  return terms.length ? terms : null;
}

function formatPoly(terms: Term[]): string {
  if (!terms.length) return "0";
  return terms.map((t, i) => {
    const sign = t.coef < 0 ? "−" : i === 0 ? "" : "+";
    const abs = Math.abs(t.coef);
    const cp = abs === 1 && t.exp > 0 ? "" : String(abs);
    const vp = t.exp === 0 ? "" : t.exp === 1 ? "x" : `x^${t.exp}`;
    return `${sign}${sign && i > 0 ? " " : ""}${cp}${vp}`;
  }).join(" ");
}

function factorQuadratic(terms: Term[]): string | null {
  const d2 = terms.find((t) => t.exp === 2);
  const d1 = terms.find((t) => t.exp === 1);
  const d0 = terms.find((t) => t.exp === 0);
  if (!d2) return null;
  const a = d2.coef, b = d1?.coef ?? 0, c = d0?.coef ?? 0;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  if (!Number.isInteger(sq)) return null;
  const r1 = (-b + sq) / (2 * a), r2 = (-b - sq) / (2 * a);
  const fr = (r: number) => Number.isInteger(r) ? String(r) : r.toFixed(3);
  const s1 = r1 >= 0 ? "−" : "+", s2 = r2 >= 0 ? "−" : "+";
  return a === 1
    ? `(x ${s1} ${fr(Math.abs(r1))})(x ${s2} ${fr(Math.abs(r2))})`
    : `${a}(x ${s1} ${fr(Math.abs(r1))})(x ${s2} ${fr(Math.abs(r2))})`;
}

export function PolynomialPanel() {
  const [input, setInput] = useState("x^2 - 5x + 6");
  const parsed = useMemo(() => parsePoly(input), [input]);
  const analysis = useMemo(() => {
    if (!parsed) return null;
    const gcf = parsed.reduce((g, t) => gcd(g, t.coef), 0);
    return {
      gcf,
      factored: factorQuadratic(parsed),
      degree: parsed[0].exp,
      leading: parsed[0].coef,
      constant: parsed.find((t) => t.exp === 0)?.coef ?? 0,
    };
  }, [parsed]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Polynomial Input</CardTitle>
          <CardDescription>Use ^ for powers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput("x^2 - 5x + 6")}>x²−5x+6</Button>
            <Button variant="outline" size="sm" onClick={() => setInput("2x^2 + 7x + 3")}>2x²+7x+3</Button>
            <Button variant="outline" size="sm" onClick={() => setInput("x^3 - 6x^2 + 11x - 6")}>Cubic</Button>
          </div>
          {parsed && (
            <div className="rounded-xl bg-blue-600/10 p-4 ring-1 ring-blue-500/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Standard form</p>
              <p className="mt-1 font-mono text-lg text-white">{formatPoly(parsed)}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Factoring &amp; Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {!parsed ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
              Could not parse. Try 3x^2 - 12.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["Degree", analysis!.degree], ["Leading", analysis!.leading],
                  ["Constant", analysis!.constant], ["GCF", analysis!.gcf],
                  ["Terms", parsed.length],
                ].map(([l, v]) => (
                  <div key={String(l)} className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{l}</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Factored form</p>
                <p className="mt-1 font-mono text-lg text-white">
                  {analysis!.factored
                    ? analysis!.factored
                    : analysis!.gcf > 1
                      ? `${analysis!.gcf}(${formatPoly(parsed.map((t) => ({ ...t, coef: t.coef / analysis!.gcf })))})`
                      : "No simple integer factorization"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= COORDINATE ================= */
export function CoordinatePanel() {
  const [x1, setX1] = useState("1");
  const [y1, setY1] = useState("2");
  const [x2, setX2] = useState("4");
  const [y2, setY2] = useState("6");
  const r = useMemo(() => {
    const X1 = parseFloat(x1), Y1 = parseFloat(y1), X2 = parseFloat(x2), Y2 = parseFloat(y2);
    if ([X1, Y1, X2, Y2].some(isNaN)) return null;
    const dx = X2 - X1, dy = Y2 - Y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mx = (X1 + X2) / 2, my = (Y1 + Y2) / 2;
    const slope = dx === 0 ? null : dy / dx;
    const perp = slope === null ? "0" : slope === 0 ? "Undefined" : fmt(-1 / slope);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const lineEq = slope === null ? `x = ${fmt(X1)}` : slope === 0 ? `y = ${fmt(Y1)}` :
      `y = ${fmt(slope)}x ${Y1 - slope * X1 >= 0 ? "+" : "−"} ${fmt(Math.abs(Y1 - slope * X1))}`;
    return { dx, dy, dist, mx, my, slope: slope === null ? "Undefined" : fmt(slope), perp, angle, lineEq };
  }, [x1, y1, x2, y2]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Two Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[["x₁", x1, setX1], ["y₁", y1, setY1], ["x₂", x2, setX2], ["y₂", y2, setY2]].map(([l, v, s]) => (
              <div key={String(l)} className="space-y-2">
                <Label>{l as string}</Label>
                <Input type="number" value={v as string} onChange={(e) => (s as (x: string) => void)(e.target.value)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Coordinate Geometry</CardTitle>
        </CardHeader>
        <CardContent>
          {!r ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              Enter all four coordinates.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["Distance", fmt(r.dist)], ["Midpoint x", fmt(r.mx)], ["Midpoint y", fmt(r.my)],
                  ["Δx", fmt(r.dx)], ["Δy", fmt(r.dy)], ["Slope", r.slope],
                ].map(([l, v], i) => (
                  <div key={l} className={cn("rounded-xl border p-3", i < 3 ? "border-blue-500/40 bg-blue-600/10" : "border-slate-700 bg-slate-800/50")}>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{l}</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Line equation</p>
                <p className="mt-1 font-mono text-lg text-white">{r.lineEq}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-600/10 p-4 ring-1 ring-blue-500/40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Perpendicular slope</p>
                  <p className="mt-1 font-mono text-base text-white">{r.perp}</p>
                </div>
                <div className="rounded-xl bg-blue-600/10 p-4 ring-1 ring-blue-500/40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Angle</p>
                  <p className="mt-1 font-mono text-base text-white">{fmt(r.angle)}°</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= GEOMETRY ================= */
type ShapeId = "rectangle" | "triangle" | "circle" | "trapezoid" | "parallelogram" | "sphere" | "cylinder" | "cone" | "rectPrism";
const SHAPES: Record<ShapeId, { name: string; fields: { key: string; label: string; def: string }[]; compute: (v: Record<string, number>) => { label: string; value: number }[] }> = {
  rectangle: { name: "Rectangle", fields: [{ key: "w", label: "Width", def: "5" }, { key: "h", label: "Height", def: "3" }], compute: (v) => [{ label: "Area", value: v.w * v.h }, { label: "Perimeter", value: 2 * (v.w + v.h) }, { label: "Diagonal", value: Math.sqrt(v.w ** 2 + v.h ** 2) }] },
  triangle: { name: "Triangle", fields: [{ key: "b", label: "Base", def: "6" }, { key: "h", label: "Height", def: "4" }], compute: (v) => [{ label: "Area", value: 0.5 * v.b * v.h }] },
  circle: { name: "Circle", fields: [{ key: "r", label: "Radius", def: "4" }], compute: (v) => [{ label: "Area", value: Math.PI * v.r ** 2 }, { label: "Circumference", value: 2 * Math.PI * v.r }, { label: "Diameter", value: 2 * v.r }] },
  trapezoid: { name: "Trapezoid", fields: [{ key: "a", label: "Base a", def: "8" }, { key: "b", label: "Base b", def: "4" }, { key: "h", label: "Height", def: "5" }], compute: (v) => [{ label: "Area", value: 0.5 * (v.a + v.b) * v.h }] },
  parallelogram: { name: "Parallelogram", fields: [{ key: "b", label: "Base", def: "7" }, { key: "h", label: "Height", def: "3" }], compute: (v) => [{ label: "Area", value: v.b * v.h }] },
  sphere: { name: "Sphere", fields: [{ key: "r", label: "Radius", def: "3" }], compute: (v) => [{ label: "Volume", value: (4 / 3) * Math.PI * v.r ** 3 }, { label: "Surface area", value: 4 * Math.PI * v.r ** 2 }] },
  cylinder: { name: "Cylinder", fields: [{ key: "r", label: "Radius", def: "3" }, { key: "h", label: "Height", def: "7" }], compute: (v) => [{ label: "Volume", value: Math.PI * v.r ** 2 * v.h }, { label: "Surface area", value: 2 * Math.PI * v.r * (v.r + v.h) }] },
  cone: { name: "Cone", fields: [{ key: "r", label: "Radius", def: "3" }, { key: "h", label: "Height", def: "5" }], compute: (v) => { const s = Math.sqrt(v.r ** 2 + v.h ** 2); return [{ label: "Volume", value: (1 / 3) * Math.PI * v.r ** 2 * v.h }, { label: "Slant", value: s }, { label: "Surface area", value: Math.PI * v.r * (v.r + s) }]; } },
  rectPrism: { name: "Rectangular Prism", fields: [{ key: "l", label: "Length", def: "5" }, { key: "w", label: "Width", def: "3" }, { key: "h", label: "Height", def: "4" }], compute: (v) => [{ label: "Volume", value: v.l * v.w * v.h }, { label: "Surface area", value: 2 * (v.l * v.w + v.l * v.h + v.w * v.h) }, { label: "Diagonal", value: Math.sqrt(v.l ** 2 + v.w ** 2 + v.h ** 2) }] },
};

export function GeometryPanel() {
  const [shape, setShape] = useState<ShapeId>("rectangle");
  const [values, setValues] = useState<Record<string, string>>({});
  const def = SHAPES[shape];
  const results = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const f of def.fields) {
      const n = parseFloat(values[f.key] ?? f.def);
      if (isNaN(n)) return null;
      nums[f.key] = n;
    }
    return def.compute(nums);
  }, [def, values]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Figure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Shape</Label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as ShapeId)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {Object.entries(SHAPES).map(([id, s]) => <option key={id} value={id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {def.fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label}</Label>
                <Input type="number" value={values[f.key] ?? f.def} onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Computed Values</CardTitle>
        </CardHeader>
        <CardContent>
          {!results ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">Enter valid numbers.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {results.map((r, i) => (
                <div key={r.label} className={cn("rounded-xl border p-4", i === 0 ? "border-blue-500/40 bg-blue-600/10" : "border-slate-700 bg-slate-800/50")}>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{r.label}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-white">{fmt(r.value)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}