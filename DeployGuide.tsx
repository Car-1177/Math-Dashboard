import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/AccentContext";
import { Rocket, Globe, Server, Database, Search, DollarSign, CheckCircle2 } from "lucide-react";

type Step = {
  icon: typeof Rocket;
  title: string;
  time: string;
  free: boolean;
  body: string[];
};

const STEPS: Step[] = [
  {
    icon: Rocket,
    title: "1. Build the production bundle",
    time: "~2 min",
    free: true,
    body: [
      "Run `npm run build` in your project folder.",
      "This creates a `dist/` folder with optimized HTML, CSS, and JS.",
      "Test it locally with `npm run preview` before deploying.",
    ],
  },
  {
    icon: Globe,
    title: "2. Deploy the static site (free)",
    time: "~5 min",
    free: true,
    body: [
      "Push your code to GitHub.",
      "Connect the repo to Vercel, Netlify, or Cloudflare Pages.",
      "Build command: `npm run build` · Output folder: `dist`.",
      "You get a live URL like `mathdash.vercel.app` instantly.",
    ],
  },
  {
    icon: Server,
    title: "3. Add a custom domain",
    time: "~15 min",
    free: false,
    body: [
      "Buy a domain (Namecheap, Cloudflare, Google Domains) — ~$10/year.",
      "In your host's dashboard, add the domain and copy the DNS records.",
      "Paste those records into your registrar. HTTPS is automatic.",
    ],
  },
  {
    icon: Database,
    title: "4. Make data real (accounts + shared Q&A)",
    time: "~1 weekend",
    free: true,
    body: [
      "Right now everything saves to localStorage — only on one device.",
      "Add Supabase or Firebase for real user accounts and a shared database.",
      "Swap `usePersistentState` for Supabase queries in CommunityPanel.",
      "This makes the Community Q&A visible to everyone, not just you.",
    ],
  },
  {
    icon: Search,
    title: "5. Get found (SEO + analytics)",
    time: "~1 hour",
    free: true,
    body: [
      "Add a `<title>`, meta description, and Open Graph tags in index.html.",
      "Submit your sitemap to Google Search Console.",
      "Add Vercel Analytics or Plausible to see what people use.",
    ],
  },
  {
    icon: DollarSign,
    title: "6. Optional: make money",
    time: "ongoing",
    free: true,
    body: [
      "Google AdSense for display ads (easy, low revenue).",
      "Stripe for a premium tier (ad-free, saved worksheets, tutor chat).",
      "Affiliate links to textbooks or graphing calculators.",
    ],
  },
];

export function DeployGuide() {
  const accent = useAccent();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white", accent.solid)}>
              <Rocket className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="font-serif text-2xl">Ship it: from code to live site</CardTitle>
              <CardDescription>
                Six steps to put this dashboard on the internet. Most are free.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn("flex items-start gap-3 rounded-xl border p-4", accent.ring, accent.tint)}>
            <CheckCircle2 className={cn("mt-0.5 h-5 w-5 shrink-0", accent.text)} />
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">The short version:</span> run{" "}
              <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-white">npm run build</code>,
              drag the <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-white">dist</code>{" "}
              folder onto Netlify Drop, and you have a live website in under five minutes. Everything below is the
              polished version.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.title}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accent.tint)}>
                      <Icon className={cn("h-5 w-5", accent.text)} />
                    </span>
                    <CardTitle className="font-serif text-lg">{step.title}</CardTitle>
                  </div>
                  <Badge variant={step.free ? "secondary" : "outline"} className="shrink-0">
                    {step.free ? "Free" : "Paid"}
                  </Badge>
                </div>
                <CardDescription>Estimated time: {step.time}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.body.map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", accent.solid)} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recommended stack for going real</CardTitle>
          <CardDescription>What to add once you outgrow a static site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Hosting", "Vercel or Netlify — free tier is plenty"],
              ["Domain", "Cloudflare Registrar — at-cost pricing"],
              ["Auth + DB", "Supabase — Postgres, auth, and realtime"],
              ["File storage", "Supabase Storage or Cloudflare R2"],
              ["Analytics", "Plausible or Vercel Analytics"],
              ["Payments", "Stripe Checkout — no monthly fee"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}