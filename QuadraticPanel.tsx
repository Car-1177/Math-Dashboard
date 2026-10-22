import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(4);
}

export function QuadraticPanel() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");

  const result = useMemo(() => {
    const A = parseFloat(a);
    const B = parseFloat(b);
    const C = parseFloat(c);
    if (isNaN(A) || isNaN(B) || isNaN(C)) {
      return { error: "Enter valid numbers for a, b, and c." };
    }
    if (A === 0) {
      return { error: "a cannot be 0 — that would be a linear equation, not quadratic." };
    }

    const disc = B * B - 4 * A * C;
    const vertexX = -B / (2 * A);
    const vertexY = A * vertexX * vertexX + B * vertexX + C;

    let roots: string[] = [];
    let nature = "";
    if (disc > 0) {
      nature = "Two distinct real roots";
      const r1 = (-B + Math.sqrt(disc)) / (2 * A);
      const r2 = (-B - Math.sqrt(disc)) / (2 * A);
      roots = [`x₁ = ${fmt(r1)}`, `x₂ = ${fmt(r2)}`];
    } else if (disc === 0) {
      nature = "One repeated real root";
      roots = [`x = ${fmt(-B / (2 * A))}`];
    } else {
      nature = "Two complex conjugate roots";
      const re = -B / (2 * A);
      const im = Math.sqrt(-disc) / (2 * A);
      roots = [
        `x₁ = ${fmt(re)} + ${fmt(Math.abs(im))}i`,
        `x₂ = ${fmt(re)} − ${fmt(Math.abs(im))}i`,
      ];
    }

    const sumRoots = -B / A;
    const productRoots = C / A;
    const axis = vertexX;
    const opens = A > 0 ? "Upward (minimum)" : "Downward (maximum)";

    return {
      disc,
      nature,
      roots,
      vertexX,
      vertexY,
      axis,
      opens,
      sumRoots,
      productRoots,
      factored: disc >= 0 ? "see roots" : "not factorable over reals",
    };
  }, [a, b, c]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">ax² + bx + c = 0</CardTitle>
          <CardDescription>Solve, find the vertex, and read the discriminant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qa">a</Label>
              <Input id="qa" type="number" value={a} onChange={(e) => setA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qb">b</Label>
              <Input id="qb" type="number" value={b} onChange={(e) => setB(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qc">c</Label>
              <Input id="qc" type="number" value={c} onChange={(e) => setC(e.target.value)} />
            </div>
          </div>
          <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Equation</p>
            <p className="mt-1 font-mono text-lg text-teal-900">
              {a || "a"}x² + {b || "b"}x + {c || "c"} = 0
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Analysis</CardTitle>
          <CardDescription>Discriminant, roots, vertex, and axis of symmetry.</CardDescription>
        </CardHeader>
        <CardContent>
          {result.error ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {result.error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Discriminant (Δ)" value={fmt(result.disc!)} accent />
                <Stat label="Vertex x" value={fmt(result.vertexX!)} />
                <Stat label="Vertex y" value={fmt(result.vertexY!)} />
                <Stat label="Axis of symmetry" value={`x = ${fmt(result.axis!)}`} />
                <Stat label="Sum of roots" value={fmt(result.sumRoots!)} />
                <Stat label="Product of roots" value={fmt(result.productRoots!)} />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {result.nature}
                </p>
                <div className="mt-2 space-y-1 font-mono text-base text-slate-800">
                  {result.roots!.map((r) => (
                    <p key={r}>{r}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  Parabola opens
                </p>
                <p className="mt-1 text-sm text-teal-900">{result.opens}</p>
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