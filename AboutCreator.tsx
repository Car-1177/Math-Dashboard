import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

export function AboutCreator() {
  const accent = useAccent();
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white", accent.solid)}>
              <User className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="font-serif text-2xl">Carson Hicks</CardTitle>
              <CardDescription>Creator &amp; Developer of this dashboard</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-300">
            This Math &amp; Statistics Dashboard was designed and built by Carson Hicks to give students a
            single place to solve algebra and geometry problems, study formulas, and prepare for the SAT and ACT.
          </p>
          <div className="space-y-3">
            <a
              href="mailto:CHicks9535@colliervilledragons.org"
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 transition-colors hover:opacity-90",
                accent.ring,
                accent.tint
              )}
            >
              <Mail className={cn("h-5 w-5", accent.text)} />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">School Email</p>
                <p className="font-mono text-sm text-white">CHicks9535@colliervilledragons.org</p>
              </div>
            </a>
            <a
              href="mailto:carsonhicks010@gmail.com"
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 transition-colors hover:opacity-90",
                accent.ring,
                accent.tint
              )}
            >
              <Mail className={cn("h-5 w-5", accent.text)} />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Personal Email</p>
                <p className="font-mono text-sm text-white">carsonhicks010@gmail.com</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">About this project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="flex items-start gap-2">
            <Sparkles className={cn("mt-0.5 h-4 w-4 shrink-0", accent.text)} />
            <p>30+ calculators and study tools spanning algebra, geometry, statistics, and test prep.</p>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className={cn("mt-0.5 h-4 w-4 shrink-0", accent.text)} />
            <p>Themeable accent colors, light/dark mode, and a persistent study streak.</p>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className={cn("mt-0.5 h-4 w-4 shrink-0", accent.text)} />
            <p>Built with React, TypeScript, and Tailwind CSS.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}