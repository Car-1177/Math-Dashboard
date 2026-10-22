import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

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
              {/* gridlines */}
              {ticks.map((t) => (
                <g key={`g${t}`}>
                  <line
                    x1={toPx(t)}
                    y1={0}
                    x2={toPx(t)}
                    y2={H}
                    stroke="#1e293b"
                    strokeWidth={1}
                  />
                  <line
                    x1={0}
                    y1={toPy(t)}
                    x2={W}
                    y2={toPy(t)}
                    stroke="#1e293b"
                    strokeWidth={1}
                  />
                </g>
              ))}

              {/* axes */}
              <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#94a3b8" strokeWidth={2} />
              <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#94a3b8" strokeWidth={2} />

              {/* tick marks + numbers */}
              {ticks.map((t) => (
                <g key={`t${t}`}>
                  {t !== 0 && (
                    <>
                      <line
                        x1={toPx(t)}
                        y1={H / 2 - 5}
                        x2={toPx(t)}
                        y2={H / 2 + 5}
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                      />
                      <text
                        x={toPx(t)}
                        y={H / 2 + 18}
                        fill="#cbd5e1"
                        fontSize={11}
                        textAnchor="middle"
                      >
                        {t}
                      </text>
                      <line
                        x1={W / 2 - 5}
                        y1={toPy(t)}
                        x2={W / 2 + 5}
                        y2={toPy(t)}
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                      />
                      <text
                        x={W / 2 - 9}
                        y={toPy(t) + 4}
                        fill="#cbd5e1"
                        fontSize={11}
                        textAnchor="end"
                      >
                        {t}
                      </text>
                    </>
                  )}
                </g>
              ))}

              {/* origin label */}
              <text x={W / 2 - 9} y={H / 2 + 18} fill="#cbd5e1" fontSize={11} textAnchor="end">
                0
              </text>

              {/* curves */}
              {paths.map((p) =>
                p.ok && p.d ? (
                  <path key={p.id} d={p.d} fill="none" stroke={p.color} strokeWidth={2.5} />
                ) : null
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
                onChange={(e) =>
                  setFns((prev) => prev.map((p) => (p.id === f.id ? { ...p, expr: e.target.value } : p)))
                }
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
                setFns((prev) => [
                  ...prev,
                  { id: Date.now(), expr: "x", color: COLORS[prev.length % COLORS.length] },
                ])
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