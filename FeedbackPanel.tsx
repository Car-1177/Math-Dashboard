import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug, Lightbulb, Mail, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCENT } from "@/theme";

const EMAIL = "carsonhicks010@gmail.com";
const SCHOOL_EMAIL = "CHicks9535@colliervilledragons.org";

export function FeedbackPanel() {
  const accent = ACCENT;
  const [kind, setKind] = useState<"feedback" | "bug">("feedback");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const subject = encodeURIComponent(
    `[${kind === "bug" ? "BUG" : "FEEDBACK"}] ${topic || "Math Toolkit"}`
  );
  const body = encodeURIComponent(
    `Type: ${kind === "bug" ? "Bug report" : "Feature request / feedback"}\n` +
      `Topic: ${topic || "(none)"}\n\n` +
      `Details:\n${details || "(describe it here)"}\n\n` +
      `— Sent from the Math & Statistics Dashboard`
  );
  const mailto = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Send Feedback or Report a Bug</CardTitle>
          <CardDescription>
            Tell me what to add, fix, or improve — it goes straight to my inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setKind("feedback")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition",
                kind === "feedback"
                  ? cn("border-transparent text-white", accent.solid)
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <Lightbulb className="h-4 w-4" />
              Idea / Feedback
            </button>
            <button
              type="button"
              onClick={() => setKind("bug")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition",
                kind === "bug"
                  ? "border-transparent bg-rose-500 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <Bug className="h-4 w-4" />
              Bug Report
            </button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              {kind === "bug" ? "Which tool is broken?" : "What should I add?"}
            </Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={kind === "bug" ? "e.g. Graph panel" : "e.g. Matrix calculator"}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-500">Details</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              placeholder={
                kind === "bug"
                  ? "What did you do, what did you expect, and what happened?"
                  : "Describe the feature or improvement you'd like to see."
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className={cn("gap-2 border-transparent text-white", accent.solid)}>
              <a href={mailto} onClick={() => setSent(true)}>
                <Send className="h-4 w-4" />
                Open in email
              </a>
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `${kind === "bug" ? "BUG" : "FEEDBACK"}: ${topic}\n\n${details}`
                );
                setSent(true);
              }}
            >
              Copy message
            </Button>
            {sent && (
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Ready to send
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Reach Me Directly</CardTitle>
          <CardDescription>Email anytime — I read everything.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <a
            href={`mailto:${EMAIL}`}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 transition hover:bg-slate-50",
              accent.ring,
              accent.tint
            )}
          >
            <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Personal</p>
              <p className="font-mono text-xs text-slate-500 break-all">{EMAIL}</p>
            </div>
          </a>

          <a
            href={`mailto:${SCHOOL_EMAIL}`}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
          >
            <Mail className="mt-0.5 h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800">School</p>
              <p className="font-mono text-xs text-slate-500 break-all">{SCHOOL_EMAIL}</p>
            </div>
          </a>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Good reports include</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              <li>• The tool name and what you typed</li>
              <li>• What you expected vs. what happened</li>
              <li>• A screenshot if you can</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Fast replies</Badge>
            <Badge variant="secondary">Feature ideas welcome</Badge>
            <Badge variant="secondary">Bug fixes prioritized</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}