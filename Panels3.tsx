import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent, ACCENTS, type Accent } from "@/components/AccentContext";

/* ================= PRACTICE TESTS ================= */
type Question = { q: string; choices: string[]; answer: number; explain: string };

const BANK: Record<string, Record<string, Question[]>> = {
  act: {
    prealgebra: [
      { q: "What is 15% of 240?", choices: ["24", "30", "36", "40"], answer: 2, explain: "0.15 × 240 = 36." },
      { q: "Simplify: 3(2x − 4) + 5x", choices: ["11x − 12", "11x − 4", "6x − 12", "11x + 12"], answer: 0, explain: "6x − 12 + 5x = 11x − 12." },
      { q: "A shirt costs $40 and is 25% off. Sale price?", choices: ["$10", "$25", "$30", "$35"], answer: 2, explain: "40 × 0.75 = 30." },
    ],
    elementary: [
      { q: "Solve: 2x + 7 = 19", choices: ["5", "6", "7", "8"], answer: 1, explain: "2x = 12 → x = 6." },
      { q: "Factor: x² − 9", choices: ["(x−3)(x+3)", "(x−9)(x+1)", "(x−3)²", "(x+3)²"], answer: 0, explain: "Difference of squares." },
      { q: "y = 3x − 5 has y-intercept:", choices: ["3", "−5", "5", "−3"], answer: 1, explain: "b = −5." },
    ],
    intermediate: [
      { q: "Solve: x² − 5x + 6 = 0", choices: ["x = 2, 3", "x = −2, −3", "x = 1, 6", "x = −1, −6"], answer: 0, explain: "(x−2)(x−3) = 0." },
      { q: "Vertex of y = (x − 2)² + 3?", choices: ["(2, 3)", "(−2, 3)", "(2, −3)", "(3, 2)"], answer: 0, explain: "Vertex form (h, k)." },
      { q: "If log₂(x) = 5, x = ?", choices: ["25", "32", "10", "16"], answer: 1, explain: "2⁵ = 32." },
    ],
    coordinate: [
      { q: "Distance between (1, 2) and (4, 6)?", choices: ["3", "4", "5", "7"], answer: 2, explain: "√(9+16) = 5." },
      { q: "Midpoint of (2, 8) and (6, 4)?", choices: ["(4, 6)", "(8, 12)", "(3, 5)", "(4, 5)"], answer: 0, explain: "Average coordinates." },
      { q: "Slope through (0, 0) and (3, 9)?", choices: ["1/3", "3", "6", "9"], answer: 1, explain: "9/3 = 3." },
    ],
    plane: [
      { q: "Rectangle 8 by 5. Area?", choices: ["13", "26", "40", "80"], answer: 2, explain: "8 × 5 = 40." },
      { q: "Triangle angles sum to:", choices: ["90°", "180°", "270°", "360°"], answer: 1, explain: "Always 180°." },
      { q: "Circle radius 6. Area?", choices: ["12π", "36π", "6π", "18π"], answer: 1, explain: "πr² = 36π." },
    ],
    trig: [
      { q: "sin(30°) = ?", choices: ["1/2", "√3/2", "1", "0"], answer: 0, explain: "sin 30° = 0.5." },
      { q: "tan(45°) = ?", choices: ["0", "1", "√3", "1/2"], answer: 1, explain: "tan 45° = 1." },
      { q: "If sin θ = 3/5, cos θ = ?", choices: ["4/5", "3/4", "5/3", "5/4"], answer: 0, explain: "3-4-5 triangle." },
    ],
  },
  sat: {
    algebra: [
      { q: "If 3x + 5 = 20, x = ?", choices: ["3", "5", "7", "15"], answer: 1, explain: "3x = 15." },
      { q: "Solve: 2(x − 3) = 4x + 8", choices: ["x = −7", "x = 7", "x = −1", "x = 1"], answer: 0, explain: "2x − 6 = 4x + 8 → x = −7." },
      { q: "(x + 4)(x − 4) = ?", choices: ["x² − 16", "x² + 16", "x² − 8x + 16", "x² + 8x − 16"], answer: 0, explain: "Difference of squares." },
    ],
    advanced: [
      { q: "Sum of roots of x² − 7x + 12 = 0?", choices: ["7", "12", "−7", "−12"], answer: 0, explain: "−b/a = 7." },
      { q: "If f(x) = x² + 2x, f(−3) = ?", choices: ["3", "−3", "15", "−15"], answer: 0, explain: "9 − 6 = 3." },
      { q: "Simplify: (x²)³ · x⁻⁴", choices: ["x²", "x⁶", "x⁻²", "x¹⁰"], answer: 0, explain: "x⁶ · x⁻⁴ = x²." },
    ],
    data: [
      { q: "Mean of 4, 8, 10, 14?", choices: ["8", "9", "10", "12"], answer: 1, explain: "36/4 = 9." },
      { q: "Bag has 3 red, 7 blue. P(red)?", choices: ["3/10", "3/7", "7/10", "1/3"], answer: 0, explain: "3 of 10." },
      { q: "20% increase then 20% decrease gives:", choices: ["4% decrease", "no change", "4% increase", "40% decrease"], answer: 0, explain: "1.2 × 0.8 = 0.96." },
    ],
    geometry: [
      { q: "Circle circumference 10π. Radius?", choices: ["5", "10", "20", "2.5"], answer: 0, explain: "2πr = 10π → r = 5." },
      { q: "30-60-90 with short leg 4. Hypotenuse?", choices: ["8", "4√3", "4√2", "12"], answer: 0, explain: "2 × short leg." },
      { q: "Cube side 3. Volume?", choices: ["27", "9", "18", "54"], answer: 0, explain: "s³ = 27." },
    ],
  },
};
BANK.psat = BANK.sat;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Props = { onAnswer?: (entry: string) => void };

export function PracticePanel({ onAnswer }: Props) {
  const accent = useAccent();
  const [exam, setExam] = useState<"act" | "sat" | "psat">("act");
  const [topic, setTopic] = useState("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const topics = Object.keys(BANK[exam]);

  const start = () => {
    const bank = BANK[exam];
    const pool = topic === "all" ? Object.values(bank).flat() : bank[topic] ?? [];
    setQuestions(shuffle(pool).slice(0, 10));
    setIndex(0);
    setSelected(null);
    setCorrect(0);
    setAnswered(0);
  };

  const current = questions[index];
  const done = questions.length > 0 && index >= questions.length;

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswered((a) => a + 1);
    if (i === current.answer) {
      setCorrect((c) => c + 1);
      onAnswer?.(`${exam.toUpperCase()} correct: ${current.q}`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Practice Tests</CardTitle>
          <CardDescription>ACT · SAT · PSAT drills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Exam</Label>
            <select
              value={exam}
              onChange={(e) => {
                setExam(e.target.value as typeof exam);
                setTopic("all");
                setQuestions([]);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              <option value="act">ACT</option>
              <option value="sat">SAT</option>
              <option value="psat">PSAT</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Topic</Label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
              <option value="all">Mixed (all topics)</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={start} className={accent.solid}>Start drill</Button>
            <Button variant="outline" onClick={() => { setQuestions([]); setIndex(0); setCorrect(0); setAnswered(0); }}>Reset</Button>
          </div>
          <div className={cn("rounded-xl border p-4", accent.ring, accent.tint)}>
            <p className={cn("text-xs uppercase tracking-wide", accent.text)}>Score</p>
            <p className="mt-1 font-mono text-xl text-white">{correct} / {answered} correct</p>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Question</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              Press "Start drill" to begin.
            </div>
          ) : done ? (
            <div className="space-y-3">
              <div className={cn("rounded-xl border p-6 text-center", accent.ring, accent.tint)}>
                <p className={cn("text-xs uppercase tracking-wide", accent.text)}>Drill complete</p>
                <p className="mt-2 font-mono text-4xl font-bold text-white">
                  {correct} / {answered}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {answered ? Math.round((correct / answered) * 100) : 0}% correct
                </p>
              </div>
              <Button onClick={start} className={cn("w-full", accent.solid)}>Start another drill</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Question {index + 1} of {questions.length}
                </p>
                <p className="mt-2 text-base text-white">{current.q}</p>
              </div>
              <div className="space-y-2">
                {current.choices.map((c, i) => {
                  const isCorrect = i === current.answer;
                  const isPicked = i === selected;
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={selected !== null}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                        selected === null
                          ? "border-slate-700 bg-slate-800/60 text-slate-100 hover:border-blue-500 hover:bg-slate-800"
                          : isCorrect
                            ? "border-emerald-500/60 bg-emerald-600/20 text-white"
                            : isPicked
                              ? "border-red-500/60 bg-red-600/20 text-white"
                              : "border-slate-700 bg-slate-800/40 text-slate-400"
                      )}
                    >
                      <span className="font-mono font-semibold">{String.fromCharCode(65 + i)}.</span> {c}
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <div className="space-y-3">
                  <div className={cn(
                    "rounded-xl border p-4",
                    selected === current.answer
                      ? "border-emerald-500/40 bg-emerald-600/10"
                      : "border-amber-500/40 bg-amber-500/10"
                  )}>
                    <p className={cn("text-xs font-semibold uppercase tracking-wide", selected === current.answer ? "text-emerald-300" : "text-amber-300")}>
                      {selected === current.answer ? "Correct" : "Not quite"}
                    </p>
                    <p className="mt-1 text-sm text-slate-200">{current.explain}</p>
                  </div>
                  <Button
                    onClick={() => { setIndex((i) => i + 1); setSelected(null); }}
                    className={cn("w-full", accent.solid)}
                  >
                    Next question
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= REFERENCE ================= */
type RefItem = { name: string; formula: string; use: string };
const REF: { cat: string; items: RefItem[] }[] = [
  {
    cat: "Algebra",
    items: [
      { name: "Quadratic Formula", formula: "x = (−b ± √(b² − 4ac)) / 2a", use: "Roots of ax² + bx + c = 0." },
      { name: "Discriminant", formula: "Δ = b² − 4ac", use: "Δ>0 two real, Δ=0 one, Δ<0 complex." },
      { name: "Slope", formula: "m = (y₂ − y₁) / (x₂ − x₁)", use: "Steepness of a line." },
      { name: "Slope-Intercept", formula: "y = mx + b", use: "Line with slope m, y-intercept b." },
      { name: "Point-Slope", formula: "y − y₁ = m(x − x₁)", use: "Line through a point with slope m." },
      { name: "Difference of Squares", formula: "a² − b² = (a + b)(a − b)", use: "Factor binomials." },
      { name: "Perfect Square", formula: "a² ± 2ab + b² = (a ± b)²", use: "Factor trinomials." },
      { name: "Exponent Product", formula: "aᵐ · aⁿ = aᵐ⁺ⁿ", use: "Multiply like bases." },
      { name: "Exponent Power", formula: "(aᵐ)ⁿ = aᵐⁿ", use: "Power of a power." },
      { name: "Log Product", formula: "log(xy) = log x + log y", use: "Expand logs." },
      { name: "Log Quotient", formula: "log(x/y) = log x − log y", use: "Condense logs." },
      { name: "Change of Base", formula: "log_b(x) = ln x / ln b", use: "Any base from natural log." },
    ],
  },
  {
    cat: "Coordinate Geometry",
    items: [
      { name: "Distance", formula: "d = √((x₂−x₁)² + (y₂−y₁)²)", use: "Between two points." },
      { name: "Midpoint", formula: "M = ((x₁+x₂)/2, (y₁+y₂)/2)", use: "Center of a segment." },
      { name: "Circle", formula: "(x − h)² + (y − k)² = r²", use: "Center (h,k), radius r." },
      { name: "Parallel Lines", formula: "m₁ = m₂", use: "Same slope." },
      { name: "Perpendicular Lines", formula: "m₁ · m₂ = −1", use: "Negative reciprocal slopes." },
    ],
  },
  {
    cat: "Plane Geometry",
    items: [
      { name: "Rectangle Area", formula: "A = l · w", use: "Length times width." },
      { name: "Triangle Area", formula: "A = ½ · b · h", use: "Half base times height." },
      { name: "Circle Area", formula: "A = πr²", use: "Radius squared times π." },
      { name: "Circumference", formula: "C = 2πr", use: "Distance around a circle." },
      { name: "Trapezoid Area", formula: "A = ½(a + b)h", use: "Average bases times height." },
      { name: "Pythagorean", formula: "a² + b² = c²", use: "Right triangle sides." },
      { name: "Box Volume", formula: "V = l · w · h", use: "Rectangular solid." },
      { name: "Cylinder Volume", formula: "V = πr²h", use: "Circular solid." },
      { name: "Sphere Volume", formula: "V = (4/3)πr³", use: "Ball volume." },
      { name: "Cone Volume", formula: "V = (1/3)πr²h", use: "Cone volume." },
    ],
  },
  {
    cat: "Trigonometry",
    items: [
      { name: "SOH CAH TOA", formula: "sin = opp/hyp, cos = adj/hyp, tan = opp/adj", use: "Right triangle ratios." },
      { name: "Pythagorean Identity", formula: "sin²θ + cos²θ = 1", use: "Fundamental identity." },
      { name: "Law of Sines", formula: "a/sin A = b/sin B = c/sin C", use: "Any triangle." },
      { name: "Law of Cosines", formula: "c² = a² + b² − 2ab·cos C", use: "Any triangle." },
      { name: "Radian Conversion", formula: "180° = π radians", use: "Angle units." },
    ],
  },
  {
    cat: "Statistics & Growth",
    items: [
      { name: "Mean", formula: "x̄ = Σx / n", use: "Average." },
      { name: "Variance", formula: "σ² = Σ(x − x̄)² / n", use: "Spread of data." },
      { name: "Std Dev", formula: "σ = √σ²", use: "Typical distance from mean." },
      { name: "Compound Interest", formula: "A = P(1 + r/n)^(nt)", use: "Interest compounded n times/year." },
      { name: "Continuous Interest", formula: "A = Pe^(rt)", use: "Continuous compounding." },
      { name: "Exponential Growth", formula: "y = a·bˣ", use: "Growth (b>1) or decay (0<b<1)." },
      { name: "Z-Score", formula: "z = (x − μ) / σ", use: "Standard deviations from mean." },
    ],
  },
];

const CONSTANTS: [string, string][] = [
  ["π", "3.14159265"],
  ["e", "2.71828183"],
  ["φ (golden)", "1.61803399"],
  ["√2", "1.41421356"],
  ["√3", "1.73205081"],
  ["√5", "2.23606798"],
  ["1 radian", "≈ 57.2958°"],
  ["1°", "≈ 0.01745 rad"],
  ["1 mile", "1609.344 m"],
  ["1 inch", "2.54 cm"],
  ["1 kg", "2.20462 lb"],
  ["1 gallon", "3.78541 L"],
];

export function ReferencePanel() {
  const accent = useAccent();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return REF;
    const q = query.toLowerCase();
    return REF.map((g) => ({
      cat: g.cat,
      items: g.items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.formula.toLowerCase().includes(q) ||
          it.use.toLowerCase().includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Formula Reference</CardTitle>
          <CardDescription>Search across every formula in the toolkit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas, e.g. slope, area, log..."
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>Print / Export</Button>
            <Button variant="ghost" size="sm" onClick={() => setQuery("")}>Clear search</Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
          No formulas match "{query}".
        </div>
      )}

      {filtered.map((group) => (
        <div key={group.cat}>
          <h3 className={cn("mb-3 font-serif text-lg font-bold", accent.text)}>{group.cat}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((it) => (
              <div key={it.name} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-sm font-semibold text-white">{it.name}</p>
                <p className={cn("mt-2 font-mono text-sm", accent.text)}>{it.formula}</p>
                <p className="mt-2 text-xs text-slate-400">{it.use}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <h3 className={cn("mb-3 font-serif text-lg font-bold", accent.text)}>Constants &amp; Conversions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONSTANTS.map(([name, val]) => (
            <div key={name} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className={cn("mt-1 font-mono text-sm", accent.text)}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= SETTINGS ================= */
type SettingsProps = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
  history: string[];
  clearHistory: () => void;
};

export function SettingsPanel({ theme, setTheme, accent, setAccent, history, clearHistory }: SettingsProps) {
  const accentTokens = useAccent();
  const [pemdas, setPemdas] = useState(true);
  const [rounding, setRounding] = useState("4");
  const [shortcuts, setShortcuts] = useState(false);

  const accentOptions: { id: Accent; label: string; swatch: string }[] = [
    { id: "blue", label: "Blue", swatch: "bg-blue-600" },
    { id: "cyan", label: "Cyan", swatch: "bg-cyan-600" },
    { id: "indigo", label: "Indigo", swatch: "bg-indigo-600" },
    { id: "emerald", label: "Emerald", swatch: "bg-emerald-600" },
  ];

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

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Activity History</CardTitle>
          <CardDescription>Recent calculations and practice answers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {history.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              No activity yet. Use the calculator or practice tests.
            </div>
          ) : (
            <ul className="space-y-2">
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
        </CardContent>
      </Card>
    </div>
  );
}