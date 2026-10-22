import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfile, uid } from "../lib/store";
import { Sigma } from "lucide-react";

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { profile, save } = useProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (profile) return <>{children}</>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    save({ id: uid(), name: name.trim(), email: email.trim() });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 ring-1 ring-teal-400/30">
            <Sigma className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-100">MathLab</h1>
            <p className="text-sm text-slate-400">
              Pick a display name to join the community
            </p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Set up your profile</CardTitle>
            <CardDescription className="text-slate-400">
              Stored locally in your browser. No account required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Display name
                </Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email <span className="text-slate-500">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400"
              >
                Enter MathLab
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}