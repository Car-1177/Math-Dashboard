import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

function solveQuadratic(a: number, b: number, c: number): string {
  if (a === 0) return "Error: 'a' cannot be 0 in a quadratic equation.";
  const disc = b * b - 4 * a * c;
  if (disc > 0) {
    const r1 = (-b + Math.sqrt(disc)) / (2 * a);
    const r2 = (-b - Math.sqrt(disc)) / (2 * a);
    return `Two real roots:\nx₁ = ${r1.toFixed(4)}\nx₂ = ${r2.toFixed(4)}`;
  }
  if (disc === 0) {
    const r = -b / (2 * a);
    return `One distinct real root:\nx = ${r.toFixed(4)}`;
  }
  const real = -b / (2 * a);
  const imag = Math.sqrt(-disc) / (2 * a);
  return `Two complex roots:\nx₁ = ${real.toFixed(4)} + ${imag.toFixed(4)}i\nx₂ = ${real.toFixed(4)} - ${imag.toFixed(4)}i`;
}

function factorQuadratic(a: number, b: number, c: number): string {
  if (a === 0) return "Not a quadratic (a = 0).";
  const disc = b * b - 4 * a * c;
  if (disc < 0) return "Cannot factor over the reals (discriminant < 0).";

  const sqrtDisc = Math.sqrt(disc);
  const r1 = (-b + sqrtDisc) / (2 * a);
  const r2 = (-b - sqrtDisc) / (2 * a);

  const fmt = (n: number) => {
    const rounded = Math.round(n * 10000) / 10000;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(4);
  };

  if (disc === 0) {
    return `Perfect square trinomial:\n${fmt(a)}(x − ${fmt(r1)})²`;
  }
  return `Factored form:\n${fmt(a)}(x − ${fmt(r1)})(x − ${fmt(r2)})`;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function simplifyFraction(num: number, den: number): string {
  if (den === 0) return "undefined";
  const g = gcd(num, den) || 1;
  const n = num / g;
  const d = den / g;
  return d === 1 ? `${n}` : `${n}/${d}`;
}

export function AlgebraPanel() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");
  const [quadOut, setQuadOut] = useState("");
  const [factorOut, setFactorOut] = useState("");

  const parse = () => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);
    if (isNaN(na) || isNaN(nb) || isNaN(nc)) return null;
    return { na, nb, nc };
  };

  const solve = () => {
    const p = parse();
    if (!p) {
      setQuadOut("Please enter valid numbers for a, b, and c.");
      return;
    }
    setQuadOut(solveQuadratic(p.na, p.nb, p.nc));
  };

  const factor = () => {
    const p = parse();
    if (!p) {
      setFactorOut("Please enter valid numbers for a, b, and c.");
      return;
    }
    setFactorOut(factorQuadratic(p.na, p.nb, p.nc));
  };

  const [num1, setNum1] = useState("1");
  const [den1, setDen1] = useState("2");
  const [num2, setNum2] = useState("3");
  const [den2, setDen2] = useState("4");
  const [fracOut, setFracOut] = useState("");

  const computeFraction = () => {
    const n1 = parseInt(num1);
    const d1 = parseInt(den1);
    const n2 = parseInt(num2);
    const d2 = parseInt(den2);
    if ([n1, d1, n2, d2].some((x) => isNaN(x))) {
      setFracOut("Please enter valid integers.");
      return;
    }
    if (d1 === 0 || d2 === 0) {
      setFracOut("Denominators cannot be zero.");
      return;
    }
    const sumN = n1 * d2 + n2 * d1;
    const sumD = d1 * d2;
    const prodN = n1 * n2;
    const prodD = d1 * d2;
    setFracOut(
      `Sum: ${simplifyFraction(sumN, sumD)}\nProduct: ${simplifyFraction(prodN, prodD)}`
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Calculator className="h-5 w-5" />
            </span>
            <CardTitle className="font-serif text-xl">Quadratic Solver</CardTitle>
          </div>
          <CardDescription>Solve ax² + bx + c = 0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qa">a</Label>
              <Input id="qa" value={a} onChange={(e) => setA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qb">b</Label>
              <Input id="qb" value={b} onChange={(e) => setB(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qc">c</Label>
              <Input id="qc" value={c} onChange={(e) => setC(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={solve} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              Solve
            </Button>
            <Button onClick={factor} variant="outline" className="flex-1">
              Factor
            </Button>
          </div>
          {quadOut && (
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
              {quadOut}
            </pre>
          )}
          {factorOut && (
            <pre className="whitespace-pre-wrap rounded-xl border border-indigo-200 bg-indigo-50 p-3 font-mono text-sm text-indigo-900">
              {factorOut}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Fraction Calculator</CardTitle>
          <CardDescription>Add and multiply two fractions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fraction 1</Label>
              <div className="flex items-center gap-2">
                <Input value={num1} onChange={(e) => setNum1(e.target.value)} />
                <span className="text-slate-400">/</span>
                <Input value={den1} onChange={(e) => setDen1(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Fraction 2</Label>
              <div className="flex items-center gap-2">
                <Input value={num2} onChange={(e) => setNum2(e.target.value)} />
                <span className="text-slate-400">/</span>
                <Input value={den2} onChange={(e) => setDen2(e.target.value)} />
              </div>
            </div>
          </div>
          <Button onClick={computeFraction} className="w-full bg-indigo-600 hover:bg-indigo-700">
            Compute
          </Button>
          {fracOut && (
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
              {fracOut}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}