import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

// Hardcoded admin credentials
const ADMIN_EMAIL = "indrajitghosh449@gmail.com";
const ADMIN_PASSWORD = "Indrajit@1998";

export const Route = createFileRoute("/admin/auth")({
  component: AdminAuth,
});

function AdminAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Small delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      toast.success("Signed in successfully");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
      <Card className="w-full max-w-md border-border/80 bg-zinc-900/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center font-display font-bold text-white text-sm">
              IG
            </div>
            <span className="font-display font-semibold text-sm text-foreground">Portfolio CMS</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Admin Console Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the CMS dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 py-6">
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full gap-2 mt-2 h-11" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-border/40 pt-4">
          <p className="text-[10px] text-muted-foreground text-center">
            Privileged admin access only. Authorized account validation enforced.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
