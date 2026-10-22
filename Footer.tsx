import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";

export function Footer() {
  const accent = useAccent();
  return (
    <footer className="mt-10 border-t border-slate-700/40 pt-6">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate-400">
          Website Created by{" "}
          <span className={cn("font-semibold", accent.text)}>Carson Hicks</span>
        </p>
        <p className="text-xs uppercase tracking-widest text-slate-500">
          Math &amp; Statistics Dashboard
        </p>
      </div>
    </footer>
  );
}