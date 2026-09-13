import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Search, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Portfolio CMS" },
      { name: "description", content: "Admin console to manage portfolio site content." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname.endsWith("/auth") || pathname === "/admin/auth";
  const isAuthenticated =
    typeof window !== "undefined" && sessionStorage.getItem("admin_authenticated") === "true";

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthPage && !isAuthenticated) {
      navigate({ to: "/admin/auth" as any, replace: true });
    } else if (isAuthPage && isAuthenticated) {
      navigate({ to: "/admin" as any, replace: true });
    }
  }, [mounted, isAuthPage, isAuthenticated, pathname, navigate]);

  function handleSignOut() {
    sessionStorage.removeItem("admin_authenticated");
    toast.success("Signed out successfully");
    navigate({ to: "/admin/auth" as any });
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthPage) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 sticky top-0 z-40 flex items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur px-4">
            <SidebarTrigger />
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search content, projects, messages…" className="pl-9 h-9 bg-muted/40 border-border/60" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to="/">
                  <ExternalLink className="w-4 h-4" /> View site
                </Link>
              </Button>
              <Button variant="ghost" size="icon" title="Sign Out" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
