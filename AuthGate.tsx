import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../lib/useAuth";
import { Sigma, Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
      </div>
    );
  }

  if (user) return <>{children}</>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const fn = mode === "in" ? signIn : signUp;
    const msg = await fn(email.trim(), password);
    if (msg) {
      setError(msg);
    } else if (mode === "up") {
      setNotice("Account created. Check your email to confirm, then sign in.");
      setMode("in");
    }
    setBusy(false);
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
            <p className="text-sm text-slate-400">Sign in to save work and join the community</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100">
              {mode === "in" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {mode === "in"
                ? "Enter your credentials to continue."
                : "Use an email and a password of at least 6 characters."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/30">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-lg bg-teal-500/10 px-3 py-2 text-sm text-teal-300 ring-1 ring-teal-500/30">
                  {notice}
                </p>
              )}

              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400"
              >
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "in" ? "Sign in" : "Sign up"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setError(null);
                setNotice(null);
              }}
              className="mt-4 w-full text-center text-sm text-slate-400 transition-colors hover:text-teal-300"
            >
              {mode === "in"
                ? "No account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}