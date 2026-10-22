import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";
import { usePersistentState } from "@/lib/usePersistentState";
import { Plus, Trash2, CheckCircle2, Circle, Target, CalendarDays } from "lucide-react";

/* ================= FORMULA SHEET ================= */
const SHEETS: { title: string; items: [string, string][] }[] = [
  {
    title: "Algebra",
    items: [
      ["Quadratic formula", "x = (−b ± √(b² − 4ac)) / 2a"],
      ["Difference of squares", "a² − b² = (a − b)(a + b)"],
      ["Perfect square trinomial", "a² ± 2ab + b² = (a ± b)²"],
      ["Sum of cubes", "a³ + b³ = (a + b)(a² − ab + b²)"],
      ["Difference of cubes", "a³ − b³ = (a − b)(a² + ab + b²)"],
      ["Slope", "m = (y₂ − y₁) / (x₂ − x₁)"],
      ["Point-slope form", "y − y₁ = m(x − x₁)"],
      ["Exponent product rule", "aᵐ · aⁿ = aᵐ⁺ⁿ"],
      ["Exponent power rule", "(aᵐ)ⁿ = aᵐⁿ"],
      ["Log product rule", "log_b(xy) = log_b x + log_b y"],
    ],
  },
  {
    title: "Geometry",
    items: [
      ["Pythagorean theorem", "a² + b² = c²"],
      ["Distance formula", "d = √((x₂ − x₁)² + (y₂ − y₁)²)"],
      ["Midpoint formula", "M = ((x₁ + x₂)/2, (y₁ + y₂)/2)"],
      ["Circle area", "A = πr²"],
      ["Circle circumference", "C = 2πr"],
      ["Triangle area", "A = ½bh"],
      ["Trapezoid area", "A = ½(b₁ + b₂)h"],
      ["Sphere volume", "V = (4/3)πr³"],
      ["Cylinder volume", "V = πr²h"],
      ["Cone volume", "V = (1/3)πr²h"],
    ],
  },
  {
    title: "Trigonometry",
    items: [
      ["SOH-CAH-TOA", "sin = opp/hyp · cos = adj/hyp · tan = opp/adj"],
      ["Pythagorean identity", "sin²θ + cos²θ = 1"],
      ["Law of sines", "a/sin A = b/sin B = c/sin C"],
      ["Law of cosines", "c² = a² + b² − 2ab·cos C"],
      ["Double angle (sin)", "sin 2θ = 2 sin θ cos θ"],
      ["Double angle (cos)", "cos 2θ = cos²θ − sin²θ"],
      ["Radians ↔ degrees", "radians = degrees × π/180"],
      ["Unit circle", "(cos θ, sin θ) on the unit circle"],
    ],
  },
  {
    title: "Statistics & Probability",
    items: [
      ["Mean", "x̄ = (Σxᵢ) / n"],
      ["Standard deviation", "σ = √(Σ(xᵢ − x̄)² / n)"],
      ["z-score", "z = (x − μ) / σ"],
      ["Combinations", "nCr = n! / (r!(n − r)!)"],
      ["Permutations", "nPr = n! / (n − r)!"],
      ["Probability", "P(E) = favorable / total"],
      ["Compound interest", "A = P(1 + r/n)^(nt)"],
      ["Exponential growth", "y = a(1 + r)ᵗ"],
    ],
  },
];

export function FormulaSheetPanel() {
  const accent = useAccent();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {SHEETS.map((sheet) => (
        <Card key={sheet.title}>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{sheet.title}</CardTitle>
            <CardDescription>{sheet.items.length} formulas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sheet.items.map(([name, formula]) => (
                <li key={name} className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{name}</p>
                  <p className={cn("mt-0.5 font-mono text-sm", accent.text)}>{formula}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ================= STUDY PLANNER ================= */
type Task = { id: number; text: string; done: boolean; subject: string };

const SUBJECTS = ["Algebra", "Geometry", "Trig", "Stats", "Test Prep", "Other"];

export function PlannerPanel() {
  const accent = useAccent();
  const [tasks, setTasks] = usePersistentState<Task[]>("plannerTasks", [
    { id: 1, text: "Review factoring special cases", done: false, subject: "Algebra" },
    { id: 2, text: "Practice 10 unit-circle values", done: true, subject: "Trig" },
  ]);
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("Algebra");

  const add = () => {
    if (!text.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: text.trim(), done: false, subject }]);
    setText("");
  };
  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Study Planner</CardTitle>
          <CardDescription>Track what to study next. Saved automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Add a study task…"
              className="flex-1"
            />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button onClick={add} className={cn("gap-2 border-transparent text-white", accent.solid)}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              No tasks yet — add your first study goal above.
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/40 px-3 py-2"
                >
                  <button onClick={() => toggle(t.id)} className="shrink-0">
                    {t.done ? (
                      <CheckCircle2 className={cn("h-5 w-5", accent.text)} />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                  <span className={cn("flex-1 text-sm", t.done ? "text-slate-500 line-through" : "text-slate-200")}>
                    {t.text}
                  </span>
                  <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300">{t.subject}</span>
                  <button onClick={() => remove(t.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Progress</CardTitle>
          <CardDescription>Your study momentum.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("rounded-xl border p-6 text-center", accent.ring, accent.tint)}>
            <Target className={cn("mx-auto h-8 w-8", accent.text)} />
            <p className="mt-2 font-mono text-4xl font-bold text-white">{pct}%</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">complete</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-400">Done</p>
              <p className="mt-1 font-mono text-2xl font-bold text-white">{doneCount}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-400">Remaining</p>
              <p className="mt-1 font-mono text-2xl font-bold text-white">{tasks.length - doneCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-400">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <p>Your tasks are saved in this browser and restored next time you visit.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}