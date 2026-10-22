export type Accent = {
  solid: string;
  tint: string;
  ring: string;
  dot: string;
  header: string;
};

export const ACCENT: Accent = {
  solid: "bg-blue-600 hover:bg-blue-500",
  tint: "bg-blue-50",
  ring: "ring-blue-500 border-blue-500",
  dot: "bg-blue-500",
  header: "from-blue-50 via-slate-50 to-white",
};