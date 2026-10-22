import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(4);
}

export function CoordinatePanel() {
  const [x1, setX1] = useState("1");
  const [y1, setY1] = useState("2");
  const [x2, setX2] = useState("4");
  const [y2, setY2] = useState("6");

  const result = useMemo(() => {
    const X1 = parseFloat(x1);
    const Y1 = parseFloat(y1);
    const X2 = parseFloat(x2);
    const Y2 = parseFloat(y2);
    if ([X1, Y1, X2, Y2].some((v) => isNaN(v))) return null;

    const dx = X2 - X1;
    const dy = Y2 - Y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const midX = (X1 + X2) / 2;
    const midY = (Y1 + Y2) / 2;
    const slope = dx === 0 ? null : dy / dx;
    const slopeText = slope === null ? "Undefined (vertical)" : fmt(slope);
    const perpSlope = slope === null ? "0 (horizontal)" : slope === 0 ? "Undefined (vertical)" : fmt(-1 / slope);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const lineEq =
      slope === null
        ? `x = ${fmt(X1)}`
        : slope === 0
          ? `y = ${fmt(Y1)}`
          : `y = ${fmt(slope)}x ${Y1 - slope * X1 >= 0 ? "+" : "−"} ${fmt(Math.abs(Y1 - slope * X1))}`;

    return { dx, dy, distance, midX, midY, slopeText, perpSlope, angle, lineEq };
  }, [x1, y1, x2, y2]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Two Points</CardTitle>
          <CardDescription>Distance, midpoint, slope, and the line through them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="x1">x₁</Label>
              <Input id="x1" type="number" value={x1} onChange={(e) => setX1(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y1">y₁</Label>
              <Input id="y1" type="number" value={y1} onChange={(e) => setY1(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="x2">x₂</Label>
              <Input id="x2" type="number" value={x2} onChange={(e) => setX2(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y2">y₂</Label>
              <Input id="y2" type="number" value={y2} onChange={(e) => setY2(e.target.value)} />
            </div>
          </div>
          <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Points</p>
            <p className="mt-1 font-mono text-sm text-teal-900">
              P₁({x1 || "?"}, {y1 || "?"}) &nbsp;·&nbsp; P₂({x2 || "?"}, {y2 || "?"})
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Coordinate Geometry</CardTitle>
          <CardDescription>All values derived from the two points.</CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
              Enter all four coordinates.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Distance" value={fmt(result.distance)} accent />
                <Stat label="Midpoint x" value={fmt(result.midX)} />
                <Stat label="Midpoint y" value={fmt(result.midY)} />
                <Stat label="Δx" value={fmt(result.dx)} />
                <Stat label="Δy" value={fmt(result.dy)} />
                <Stat label="Slope (m)" value={result.slopeText} accent />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Line equation
                </p>
                <p className="mt-1 font-mono text-lg text-slate-800">{result.lineEq}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    Perpendicular slope
                  </p>
                  <p className="mt-1 font-mono text-base text-teal-900">{result.perpSlope}</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-4 ring-1 ring-teal-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    Angle of line
                  </p>
                  <p className="mt-1 font-mono text-base text-teal-900">{fmt(result.angle)}°</p>
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