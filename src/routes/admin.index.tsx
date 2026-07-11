import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import {
  FolderKanban, Wrench, Mail, Eye, TrendingUp, ArrowUpRight,
  Sparkles, PencilLine, CheckCircle2, Clock,
} from "lucide-react";
import { projects as mockProjects, services as mockServices, skills as mockSkills } from "@/lib/portfolio-data";
import { useFirestoreCollection, useFirestoreDoc } from "@/hooks/useFirestore";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { list: projects } = useFirestoreCollection("projects", mockProjects);
  const { list: services } = useFirestoreCollection("services", mockServices);
  const { list: messages } = useFirestoreCollection("contact_messages", []);
  const { list: skills } = useFirestoreCollection("skills", mockSkills);
  const { data: settings } = useFirestoreDoc<any>("settings", "site_settings");

  const isFreelancer = settings?.freelancerMode === true;

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban, hint: "+0 this month", tone: "text-brand-blue" },
    ...(isFreelancer ? [{ label: "Services", value: services.length, icon: Wrench, hint: "All active", tone: "text-brand-purple" }] : []),
    { label: "New Messages", value: messages.length, icon: Mail, hint: "Check messages tab", tone: "text-brand-green" },
    { label: "Page Views (30d)", value: "1.2k", icon: Eye, hint: "Estimated metrics", tone: "text-brand-orange" },
  ];

  const activity = [
    { icon: PencilLine, text: `Active portfolio configuration running`, time: "Just now" },
    { icon: CheckCircle2, text: `Loaded ${projects.length} project(s) from database`, time: "Online" },
    { icon: Mail, text: `Retrieved ${messages.length} visitor message(s)`, time: "Realtime" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content and recent activity."
        actions={
          <Button asChild size="sm" className="gap-2">
            <Link to="/admin/projects"><FolderKanban className="w-4 h-4" /> Manage projects</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-semibold mt-1">{s.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted/50 ${s.tone}`}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                <TrendingUp className="w-3 h-3" /> {s.hint}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Projects</CardTitle>
              <CardDescription>Latest changes to your project catalog.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link to="/admin/projects">View all <ArrowUpRight className="w-3 h-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.slice(0, 3).map((p) => (
              <div key={p.slug} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors">
                {p.img && <img src={p.img} alt="" className="w-12 h-12 rounded-md object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.role} · {p.year}</p>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">Published</Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/projects">Edit</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
            <CardDescription>Recent CMS actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <a.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Top Skills Overview</CardTitle>
          <CardDescription>Quick snapshot of your published skill levels.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {skills
            .filter((s: any) => s.id !== "portfolio_skills" && s.name)
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .slice(0, 6)
            .map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-purple to-brand-blue" style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

