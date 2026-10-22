import { createContext, useContext } from "react";

export type Accent = "blue" | "cyan" | "indigo" | "emerald";

type AccentTokens = {
  /** solid button / active pill */
  solid: string;
  /** highlighted border for selected option */
  ring: string;
  /** tinted background for selected option */
  tint: string;
  /** text color for accent labels */
  text: string;
  /** toggle on-state background */
  toggle: string;
  /** progress bar fill */
  bar: string;
  /** header gradient */
  gradient: string;
};

export const ACCENTS: Record<Accent, AccentTokens> = {
  blue: {
    solid: "bg-blue-600 hover:bg-blue-500",
    ring: "border-blue-500",
    tint: "bg-blue-600/20",
    text: "text-blue-300",
    toggle: "bg-blue-600",
    bar: "bg-blue-500",
    gradient: "from-blue-600 via-blue-700 to-indigo-900",
  },
  cyan: {
    solid: "bg-cyan-600 hover:bg-cyan-500",
    ring: "border-cyan-500",
    tint: "bg-cyan-600/20",
    text: "text-cyan-300",
    toggle: "bg-cyan-600",
    bar: "bg-cyan-500",
    gradient: "from-cyan-600 via-blue-700 to-slate-900",
  },
  indigo: {
    solid: "bg-indigo-600 hover:bg-indigo-500",
    ring: "border-indigo-500",
    tint: "bg-indigo-600/20",
    text: "text-indigo-300",
    toggle: "bg-indigo-600",
    bar: "bg-indigo-500",
    gradient: "from-indigo-600 via-indigo-800 to-slate-900",
  },
  emerald: {
    solid: "bg-emerald-600 hover:bg-emerald-500",
    ring: "border-emerald-500",
    tint: "bg-emerald-600/20",
    text: "text-emerald-300",
    toggle: "bg-emerald-600",
    bar: "bg-emerald-500",
    gradient: "from-emerald-600 via-teal-800 to-slate-900",
  },
};

const AccentContext = createContext<AccentTokens>(ACCENTS.blue);

export function AccentProvider({ accent, children }: { accent: Accent; children: React.ReactNode }) {
  return <AccentContext.Provider value={ACCENTS[accent]}>{children}</AccentContext.Provider>;
}

export function useAccent() {
  return useContext(AccentContext);
}