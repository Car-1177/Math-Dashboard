import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calculator,
  Sigma,
  FunctionSquare,
  GitBranch,
  Ruler,
  Shapes,
  TrendingUp,
  Settings,
  BookOpen,
  GraduationCap,
  ListChecks,
  Menu,
  X,
  ClipboardList,
  Repeat,
  FileText,
  Grid3x3,
  Dices,
  Logs,
  Circle,
  MessageSquareText,
  User,
  Users,
  Keyboard,
  Percent,
  Triangle,
  Pin,
  Rocket,
  Database,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersistentState } from "@/lib/usePersistentState";
import { AccentProvider, ACCENTS, type Accent } from "@/components/AccentContext";
import { Footer } from "@/components/Footer";
import { SearchBar, type SearchEntry } from "@/components/SearchBar";
import { AboutCreator } from "@/components/AboutCreator";
import { CalculatorPanel } from "@/components/CalculatorPanel";
import { EquationPanel } from "@/components/EquationPanel";
import { StatsPanel, QuadraticPanel, PolynomialPanel, CoordinatePanel, GeometryPanel } from "@/components/Panels1";
import {
  GrowthPanel,
  GraphPanel,
  RadicalPanel,
  SystemsPanel,
  InequalityPanel,
  FractionPanel,
  SequencePanel,
  TrianglePanel,
  ComplexPanel,
  SimilarityPanel,
  UnitCirclePanel,
} from "@/components/Panels2";
import { PracticePanel, ReferencePanel } from "@/components/Panels3";
import { SettingsPanel } from "@/components/SettingsPanel";
import { FormulaSheetPanel, PlannerPanel } from "@/components/Panels4";
import { MatrixPanel } from "@/components/Panels5";
import {
  TrigPanel,
  PercentPanel,
  LogPanel,
  ConicPanel,
  ProbabilityPanel,
  ConverterPanel,
  WordProblemPanel,
} from "@/components/ExtraPanels";
import { CommunityPanel } from "@/components/CommunityPanel";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ShortcutsOverlay } from "@/components/ShortcutsOverlay";
import { DeployGuide } from "@/components/DeployGuide";
import { SupabaseGuide } from "@/components/SupabaseGuide";

type TabId =
  | "calculator"
  | "equation"
  | "graph"
  | "stats"
  | "quadratic"
  | "polynomial"
  | "radical"
  | "systems"
  | "inequality"
  | "fraction"
  | "sequence"
  | "complex"
  | "log"
  | "matrix"
  | "coordinate"
  | "geometry"
  | "triangle"
  | "similarity"
  | "unitcircle"
  | "trig"
  | "conic"
  | "growth"
  | "percent"
  | "probability"
  | "converter"
  | "wordproblem"
  | "sat"
  | "act"
  | "practice"
  | "formulasheet"
  | "planner"
  | "reference"
  | "community"
  | "feedback"
  | "deploy"
  | "supabase"
  | "settings"
  | "about";

type Tab = {
  id: TabId;
  label: string;
  icon: typeof Calculator;
  group: string;
  keywords: string[];
  hidden?: boolean;
};

const TABS: Tab[] = [
  { id: "calculator", label: "Calculator", icon: Calculator, group: "Core", keywords: ["arithmetic", "basic", "compute", "pemdas"] },
  { id: "equation", label: "Equation Solver", icon: FunctionSquare, group: "Core", keywords: ["solve", "linear", "variable", "x"] },
  { id: "graph", label: "Graphing", icon: TrendingUp, group: "Core", keywords: ["plot", "function", "curve", "slope"] },
  { id: "stats", label: "Statistics", icon: Sigma, group: "Algebra", keywords: ["mean", "median", "mode", "average", "standard deviation"] },
  { id: "quadratic", label: "Quadratics", icon: FunctionSquare, group: "Algebra", keywords: ["roots", "parabola", "discriminant", "vertex"] },
  { id: "polynomial", label: "Polynomials", icon: GitBranch, group: "Algebra", keywords: ["factor", "expand", "degree", "synthetic division"] },
  { id: "radical", label: "Radicals", icon: GitBranch, group: "Algebra", keywords: ["square root", "simplify", "rationalize"] },
  { id: "systems", label: "Systems", icon: ListChecks, group: "Algebra", keywords: ["equations", "substitution", "elimination", "two variables"] },
  { id: "inequality", label: "Inequalities", icon: ListChecks, group: "Algebra", keywords: ["greater", "less", "interval", "number line"] },
  { id: "fraction", label: "Fractions", icon: Calculator, group: "Algebra", keywords: ["add", "subtract", "multiply", "divide", "simplify"] },
  { id: "sequence", label: "Sequences", icon: TrendingUp, group: "Algebra", keywords: ["arithmetic", "geometric", "series", "nth term"] },
  { id: "complex", label: "Complex", icon: FunctionSquare, group: "Algebra", keywords: ["imaginary", "i", "conjugate", "modulus"] },
  { id: "log", label: "Logs & Exponents", icon: Logs, group: "Algebra", keywords: ["logarithm", "power", "base", "ln"] },
  { id: "matrix", label: "Matrices", icon: Grid3x3, group: "Algebra", keywords: ["determinant", "multiply", "transpose", "rows"] },
  { id: "coordinate", label: "Coordinate", icon: Ruler, group: "Geometry", keywords: ["distance", "midpoint", "slope", "points"] },
  { id: "geometry", label: "Geometry", icon: Shapes, group: "Geometry", keywords: ["area", "perimeter", "volume", "surface"] },
  { id: "triangle", label: "Triangles", icon: Triangle, group: "Geometry", keywords: ["pythagorean", "sine", "cosine", "area", "angles"] },
  { id: "similarity", label: "Similarity", icon: Shapes, group: "Geometry", keywords: ["scale", "ratio", "proportion", "congruent"] },
  { id: "unitcircle", label: "Unit Circle", icon: Shapes, group: "Geometry", keywords: ["trig", "radians", "degrees", "sine", "cosine"] },
  { id: "trig", label: "Trigonometry", icon: Triangle, group: "Geometry", keywords: ["sine", "cosine", "tangent", "angle", "radians"] },
  { id: "conic", label: "Circles & Conics", icon: Circle, group: "Geometry", keywords: ["circle", "ellipse", "parabola", "hyperbola", "radius"] },
  { id: "growth", label: "Growth & Interest", icon: TrendingUp, group: "Applied", keywords: ["compound", "exponential", "decay", "percent"] },
  { id: "percent", label: "Percent & Proportion", icon: Percent, group: "Applied", keywords: ["percent", "change", "proportion", "ratio"] },
  { id: "probability", label: "Probability", icon: Dices, group: "Applied", keywords: ["odds", "combination", "permutation", "factorial"] },
  { id: "converter", label: "Unit Converter", icon: Repeat, group: "Applied", keywords: ["convert", "metric", "imperial", "length", "mass"] },
  { id: "wordproblem", label: "Word Problems", icon: MessageSquareText, group: "Applied", keywords: ["translate", "english", "phrase", "percent of"] },
  { id: "sat", label: "SAT", icon: GraduationCap, group: "Test Prep", keywords: ["practice", "test", "questions", "college board"] },
  { id: "act", label: "ACT", icon: GraduationCap, group: "Test Prep", keywords: ["practice", "test", "questions"] },
  { id: "practice", label: "Mixed Drill", icon: GraduationCap, group: "Test Prep", keywords: ["practice", "quiz", "random", "mixed"] },
  { id: "community", label: "Community Q&A", icon: Users, group: "Study", keywords: ["ask", "help", "tutor", "questions", "forum", "peers"] },
  { id: "formulasheet", label: "Formula Sheet", icon: FileText, group: "Study", keywords: ["formulas", "cheat sheet", "reference"] },
  { id: "planner", label: "Study Planner", icon: ClipboardList, group: "Study", keywords: ["schedule", "tasks", "goals", "todo"] },
  { id: "reference", label: "Reference", icon: BookOpen, group: "Study", keywords: ["definitions", "glossary", "theorems"] },
  { id: "feedback", label: "Feedback", icon: MessageCircle, group: "Study", keywords: ["bug", "report", "idea", "contact", "email", "suggest"] },
  { id: "deploy", label: "Publish This Site", icon: Rocket, group: "Study", keywords: ["deploy", "host", "domain", "vercel", "netlify", "launch", "website"] },
  { id: "supabase", label: "Supabase Setup", icon: Database, group: "Study", keywords: ["supabase", "database", "auth", "backend", "accounts", "postgres", "realtime"] },
  { id: "settings", label: "Settings", icon: Settings, group: "Study", keywords: ["theme", "accent", "color", "dark mode", "sidebar", "pin", "save", "reset"] },
  { id: "about", label: "About the Creator", icon: User, group: "Study", keywords: ["carson", "hicks", "email", "contact", "creator"], hidden: true },
];

const GROUPS = ["Core", "Algebra", "Geometry", "Applied", "Test Prep", "Study"];
const ACCENT_ORDER: Accent[] = ["blue", "cyan", "indigo", "emerald"];

export function App() {
  const [active, setActive] = usePersistentState<TabId>("activeTab", "calculator");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = usePersistentState<boolean>("sidebarPinned", true);
  const [theme, setTheme] = usePersistentState<"dark" | "light">("theme", "dark");
  const [accent, setAccent] = usePersistentState<Accent>("accent", "blue");
  const [history, setHistory] = usePersistentState<string[]>("history", []);
  const [streak, setStreak] = usePersistentState<number>("streak", 0);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pendingG = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const tokens = ACCENTS[accent];
  const current = TABS.find((t) => t.id === active)!;

  const addHistory = (entry: string) => {
    setHistory((h) => [entry, ...h].slice(0, 30));
    setStreak((s) => s + 1);
  };

  const searchEntries: SearchEntry[] = useMemo(
    () => TABS.map((t) => ({ id: t.id, label: t.label, group: t.group, keywords: t.keywords })),
    []
  );

  const goTo = (id: string) => {
    setActive(id as TabId);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const isTyping = (el: EventTarget | null) => {
      const t = el as HTMLElement | null;
      if (!t) return false;
      const tag = t.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShortcutsOpen(false);
        pendingG.current = false;
        return;
      }
      if (isTyping(e.target)) return;

      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
        return;
      }
      if (e.key === "t") {
        setTheme((v) => (v === "dark" ? "light" : "dark"));
        return;
      }
      if (e.key === "a") {
        setAccent((v) => ACCENT_ORDER[(ACCENT_ORDER.indexOf(v) + 1) % ACCENT_ORDER.length]);
        return;
      }
      if (e.key === "g") {
        pendingG.current = true;
        window.setTimeout(() => (pendingG.current = false), 900);
        return;
      }
      if (pendingG.current) {
        const map: Record<string, TabId> = {
          c: "calculator",
          s: "stats",
          q: "quadratic",
          p: "polynomial",
          d: "coordinate",
          m: "community",
          g: "geometry",
          t: "trig",
        };
        const target = map[e.key.toLowerCase()];
        if (target) {
          e.preventDefault();
          goTo(target);
        }
        pendingG.current = false;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showSidebar = sidebarPinned || sidebarOpen;

  return (
    <AccentProvider accent={accent}>
      <div className={cn("min-h-screen", theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900")}>
        <header className={cn("border-b border-blue-900/40 bg-gradient-to-br", tokens.gradient)}>
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              {!sidebarPinned && (
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 lg:hidden"
                  aria-label="Toggle menu"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
                <Sigma className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200/90">
                  Algebra · Geometry · Test Prep
                </p>
                <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                  Math &amp; Statistics Dashboard
                </h1>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="flex-1" ref={(el) => { if (el) searchRef.current = el.querySelector("input"); }}>
                <SearchBar entries={searchEntries} onSelect={goTo} />
              </div>
              <button
                onClick={() => setShortcutsOpen(true)}
                className="hidden rounded-xl bg-white/10 p-2.5 text-white ring-1 ring-white/20 hover:bg-white/20 sm:block"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="h-5 w-5" />
              </button>
              <div className="hidden rounded-xl bg-white/10 px-4 py-2 text-center ring-1 ring-white/20 sm:block">
                <p className="text-xs uppercase tracking-wide text-blue-200/80">Streak</p>
                <p className="font-mono text-lg font-bold text-white">{streak}</p>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-3">
            <p className="text-xs font-medium tracking-wide text-blue-100/80">
              Website Created by{" "}
              <button
                onClick={() => goTo("about")}
                className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
              >
                Carson Hicks
              </button>
              <span className="ml-3 hidden text-blue-200/70 sm:inline">
                Press <kbd className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">?</kbd> for shortcuts
              </span>
            </p>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
          <aside className={cn("w-64 shrink-0 space-y-5", showSidebar ? "block" : "hidden")}>
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Tools</p>
              {sidebarPinned ? (
                <span className="flex items-center gap-1 text-xs font-medium text-slate-500" title="Sidebar pinned in Settings">
                  <Pin className="h-3 w-3" /> Pinned
                </span>
              ) : (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white lg:hidden"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {GROUPS.map((group) => (
              <div key={group}>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">{group}</p>
                <div className="space-y-1">
                  {TABS.filter((t) => t.group === group && !t.hidden).map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === active;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => goTo(tab.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                          isActive
                            ? cn("text-white shadow-md", tokens.solid)
                            : theme === "dark"
                              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                              : "text-slate-600 hover:bg-white hover:text-blue-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-slate-700/40 pb-3">
              <h2 className="font-serif text-2xl font-bold">{current.label}</h2>
              <span className="hidden text-xs font-medium uppercase tracking-wider text-slate-500 sm:block">
                {current.group}
              </span>
            </div>

            {active === "calculator" && <CalculatorPanel onCompute={addHistory} />}
            {active === "equation" && <EquationPanel />}
            {active === "graph" && <GraphPanel />}
            {active === "stats" && <StatsPanel />}
            {active === "quadratic" && <QuadraticPanel />}
            {active === "polynomial" && <PolynomialPanel />}
            {active === "radical" && <RadicalPanel />}
            {active === "systems" && <SystemsPanel />}
            {active === "inequality" && <InequalityPanel />}
            {active === "fraction" && <FractionPanel />}
            {active === "sequence" && <SequencePanel />}
            {active === "coordinate" && <CoordinatePanel />}
            {active === "geometry" && <GeometryPanel />}
            {active === "triangle" && <TrianglePanel />}
            {active === "similarity" && <SimilarityPanel />}
            {active === "unitcircle" && <UnitCirclePanel />}
            {active === "trig" && <TrigPanel />}
            {active === "complex" && <ComplexPanel />}
            {active === "log" && <LogPanel />}
            {active === "matrix" && <MatrixPanel />}
            {active === "conic" && <ConicPanel />}
            {active === "growth" && <GrowthPanel />}
            {active === "percent" && <PercentPanel />}
            {active === "probability" && <ProbabilityPanel />}
            {active === "converter" && <ConverterPanel />}
            {active === "wordproblem" && <WordProblemPanel />}
            {active === "sat" && <PracticePanel onAnswer={addHistory} />}
            {active === "act" && <PracticePanel onAnswer={addHistory} />}
            {active === "practice" && <PracticePanel onAnswer={addHistory} />}
            {active === "community" && <CommunityPanel />}
            {active === "feedback" && <FeedbackPanel />}
            {active === "formulasheet" && <FormulaSheetPanel />}
            {active === "planner" && <PlannerPanel />}
            {active === "reference" && <ReferencePanel />}
            {active === "deploy" && <DeployGuide />}
            {active === "supabase" && <SupabaseGuide />}
            {active === "settings" && (
              <SettingsPanel
                theme={theme}
                setTheme={setTheme}
                accent={accent}
                setAccent={setAccent}
                history={history}
                clearHistory={() => setHistory([])}
                sidebarPinned={sidebarPinned}
                setSidebarPinned={setSidebarPinned}
              />
            )}
            {active === "about" && <AboutCreator />}

            <Footer />
          </main>
        </div>
      </div>

      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </AccentProvider>
  );
}

export default App;