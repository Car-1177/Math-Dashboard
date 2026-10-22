import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ShapeId =
  | "rectangle"
  | "triangle"
  | "circle"
  | "trapezoid"
  | "parallelogram"
  | "sphere"
  | "cylinder"
  | "cone"
  | "rectPrism";

type FieldDef = { key: string; label: string; def: string };

const SHAPES: Record<ShapeId, { name: string; fields: FieldDef[]; compute: (v: Record<string, number>) => { label: string; value: number }[] }> = {
  rectangle: {
    name: "Rectangle",
    fields: [
      { key: "w", label: "Width", def: "5" },
      { key: "h", label: "Height", def: "3" },
    ],
    compute: (v) => [
      { label: "Area", value: v.w * v.h },
      { label: "Perimeter", value: 2 * (v.w + v.h) },
      { label: "Diagonal", value: Math.sqrt(v.w ** 2 + v.h ** 2) },
    ],
  },
  triangle: {
    name: "Triangle (base & height)",
    fields: [
      { key: "b", label: "Base", def: "6" },
      { key: "h", label: "Height", def: "4" },
    ],
    compute: (v) => [
      { label: "Area", value: 0.5 * v.b * v.h },
      { label: "Hypotenuse (if right)", value: Math.sqrt(v.b ** 2 + v.h ** 2) },
    ],
  },
  circle: {
    name: "Circle",
    fields: [{ key: "r", label: "Radius", def: "4" }],
    compute: (v) => [
      { label: "Area", value: Math.PI * v.r ** 2 },
      { label: "Circumference", value: 2 * Math.PI * v.r },
      { label: "Diameter", value: 2 * v.r },
    ],
  },
  trapezoid: {
    name: "Trapezoid",
    fields: [
      { key: "a", label: "Base a", def: "8" },
      { key: "b", label: "Base b", def: "4" },
      { key: "h", label: "Height", def: "5" },
    ],
    compute: (v) => [{ label: "Area", value: 0.5 * (v.a + v.b) * v.h }],
  },
  parallelogram: {
    name: "Parallelogram",
    fields: [
      { key: "b", label: "Base", def: "7" },
      { key: "h", label: "Height", def: "3" },
    ],
    compute: (v) => [{ label: "Area", value: v.b * v.h }],
  },
  sphere: {
    name: "Sphere",
    fields: [{ key: "r", label: "Radius", def: "3" }],
    compute: (v) => [
      { label: "Volume", value: (4 / 3) * Math.PI * v.r ** 3 },
      { label: "Surface area", value: 4 * Math.PI * v.r ** 2 },
    ],
  },
  cylinder: {
    name: "Cylinder",
    fields: [
      { key: "r", label: "Radius", def: "3" },
      { key: "h", label: "Height", def: "7" },
    ],
    compute: (v) => [
      { label: "Volume", value: Math.PI * v.r ** 2 * v.h },
      { label: "Surface area", value: 2 * Math.PI * v.r * (v.r + v.h) },
    ],
  },
  cone: {
    name: "Cone",
    fields: [
      { key: "r", label: "Radius", def: "3" },
      { key: "h", label: "Height", def: "5" },
    ],
    compute: (v) => {
      const slant = Math.sqrt(v.r ** 2 + v.h ** 2);
      return [
        { label: "Volume", value: (1 / 3) * Math.PI * v.r ** 2 * v.h },
        { label: "Slant height", value: slant },
        { label: "Surface area", value: Math.PI * v.r * (v.r + slant) },
      ];
    },
  },
  rectPrism: {
    name: "Rectangular Prism",
    fields: [
      { key: "l", label: "Length", def: "5" },
      { key: "w", label: "Width", def: "3" },
      { key: "h", label: "Height", def: "4" },
    ],
    compute: (v) => [
      { label: "Volume", value: v.l * v.w * v.h },
      { label: "Surface area", value: 2 * (v.l * v.w + v.l * v.h + v.w * v.h) },
      { label: "Space diagonal", value: Math.sqrt(v.l ** 2 + v.w ** 2 + v.h ** 2) },
    ],
  },
};

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(4);
}

export function GeometryPanel() {
  const [shape, setShape] = useState<ShapeId>("rectangle");
  const [values, setValues] = useState<Record<string, string>>({});

  const def = SHAPES[shape];

  const results = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const f of def.fields) {
      const raw = values[f.key] ?? f.def;
      const n = parseFloat(raw);
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
          <CardDescription>Pick a shape and enter its dimensions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Shape</Label>
            <Select value={shape} onValueChange={(v) => setShape(v as ShapeId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SHAPES).map(([id, s]) => (
                  <SelectItem key={id} value={id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {def.fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={`geo-${f.key}`}>{f.label}</Label>
                <Input
                  id={`geo-${f.key}`}
                  type="number"
                  value={values[f.key] ?? f.def}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Computed Values</CardTitle>
          <CardDescription>Area, perimeter, volume, and surface area as applicable.</CardDescription>
        </CardHeader>
        <CardContent>
          {!results ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Enter valid numbers for every dimension.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {results.map((r, i) => (
                <div
                  key={r.label}
                  className={cn(
                    "rounded-xl border p-4",
                    i === 0 ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-slate-50"
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {r.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-mono text-2xl font-semibold",
                      i === 0 ? "text-teal-800" : "text-slate-800"
                    )}
                  >
                    {fmt(r.value)}
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