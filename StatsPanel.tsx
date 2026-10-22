import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function parseNumbers(text: string): number[] {
  return text
    .split(/[,\s]+/)
    .map((x) => parseFloat(x.trim()))
    .filter((x) => !isNaN(x));
}

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(4);
}

export function StatsPanel() {
  const [raw, setRaw] = useState("10, 20, 20, 35, 50");

  const data = useMemo(() => parseNumbers(raw), [raw]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const counts = new Map<number, number>();
    data.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
    let maxCount = 0;
    counts.forEach((c) => {
      if (c > maxCount) maxCount = c;
    });
    const modes: number[] = [];
    counts.forEach((c, v) => {
      if (c === maxCount) modes.push(v);
    });
    const hasMode = maxCount > 1 && modes.length !== n;

    const variancePop = data.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const varianceSample = n > 1 ? data.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1) : 0;
    const range = sorted[n - 1] - sorted[0];

    return {
      n,
      sum,
      mean,
      median,
      modes: hasMode ? modes.sort((a, b) => a - b) : [],
      modeText: hasMode ? modes.sort((a, b) => a - b).join(", ") : "No unique mode",
      min: sorted[0],
      max: sorted[n - 1],
      range,
      variancePop,
      varianceSample,
      sdPop: Math.sqrt(variancePop),
      sdSample: Math.sqrt(varianceSample),
    };
  }, [data]);

  const cells = stats
    ? [
        { label: "Count (n)", value: String(stats.n) },
        { label: "Sum", value: fmt(stats.sum) },
        { label: "Mean", value: fmt(stats.mean), accent: true },
        { label: "Median", value: fmt(stats.median), accent: true },
        { label: "Mode", value: stats.modeText, accent: true },
        { label: "Min", value: fmt(stats.min) },
        { label: "Max", value: fmt(stats.max) },
        { label: "Range", value: fmt(stats.range) },
        { label: "Variance (σ²)", value: fmt(stats.variancePop) },
        { label: "Variance (s²)", value: fmt(stats.varianceSample) },
        { label: "Std Dev (σ)", value: fmt(stats.sdPop) },
        { label: "Std Dev (s)", value: fmt(stats.sdSample) },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Descriptive Statistics</CardTitle>
          <CardDescription>
            Enter numbers separated by commas or spaces. Results update as you type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stats-input">Data set</Label>
            <Input
              id="stats-input"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="e.g. 10, 20, 20, 35, 50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setRaw("2, 4, 4, 4, 5, 5, 7, 9")}>
              Load sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setRaw("")}>
              Clear
            </Button>
          </div>
          <div className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900 ring-1 ring-teal-100">
            <p className="font-semibold">Parsed values</p>
            <p className="mt-1 break-words font-mono text-xs text-teal-800">
              {data.length ? data.join(", ") : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Results</CardTitle>
          <CardDescription>Population and sample measures are both shown.</CardDescription>
        </CardHeader>
        <CardContent>
          {!stats ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
              Enter at least one number to see statistics.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cells.map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    "rounded-xl border p-3",
                    c.accent
                      ? "border-teal-200 bg-teal-50"
                      : "border-slate-200 bg-slate-50"
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {c.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-mono text-lg font-semibold",
                      c.accent ? "text-teal-800" : "text-slate-800"
                    )}
                  >
                    {c.value}
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