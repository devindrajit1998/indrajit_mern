import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { data: settings, updateDocData } = useFirestoreDoc("settings", "site_settings", {
    title: "Indrajit Ghosh — MERN Stack Developer",
    tagline: "Building scalable web applications.",
    domain: "indrajit.dev",
    description: "Portfolio of Indrajit Ghosh — full-stack MERN developer open to full-time roles.",
    keywords: "MERN, React, Node.js, Full-stack, TypeScript",
    ogImage: "",
    github: "https://github.com/indrajit",
    linkedin: "https://linkedin.com/in/indrajit",
    twitter: "https://x.com/indrajit",
    email: "hello@indrajit.dev",
    enableContactForm: true,
    showOpenToWork: true,
    enableBlog: false,
    maintenanceMode: false,
    freelancerMode: false
  });

  const [localSettings, setLocalSettings] = useState(settings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  async function handleSave() {
    setLoading(true);
    try {
      await updateDocData(localSettings);
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate(field: string, value: any) {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  }

  if (!localSettings) return null;

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Global site configuration, SEO defaults, and integrations."
        actions={<Button size="sm" className="gap-2" onClick={handleSave} disabled={loading}><Save className="w-4 h-4" /> Save all</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
            <CardDescription>Site identity and branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Site title</Label>
              <Input value={localSettings.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={localSettings.tagline || ""} onChange={(e) => handleUpdate("tagline", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Primary domain</Label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Input value={localSettings.domain || ""} onChange={(e) => handleUpdate("domain", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO Defaults</CardTitle>
            <CardDescription>Fallback meta tags for pages without overrides.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Meta description</Label>
              <Textarea rows={3} value={localSettings.description || ""} onChange={(e) => handleUpdate("description", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Keywords</Label>
              <Input value={localSettings.keywords || ""} onChange={(e) => handleUpdate("keywords", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>OG image URL</Label>
              <Input placeholder="https://…" value={localSettings.ogImage || ""} onChange={(e) => handleUpdate("ogImage", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Social Links</CardTitle>
            <CardDescription>Displayed in the site footer and contact page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Github, label: "GitHub", key: "github" },
              { icon: Linkedin, label: "LinkedIn", key: "linkedin" },
              { icon: Twitter, label: "Twitter / X", key: "twitter" },
              { icon: Mail, label: "Public email", key: "email" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">{s.label}</Label>
                  <Input value={(localSettings as any)[s.key] || ""} onChange={(e) => handleUpdate(s.key, e.target.value)} className="h-9" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Features</CardTitle>
            <CardDescription>Toggle features across the public site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Enable contact form", desc: "Show the contact form on /contact.", key: "enableContactForm" },
              { label: "Show 'Open to work' badge", desc: "Displays availability badge in the hero.", key: "showOpenToWork" },
              { label: "Enable blog section", desc: "Adds /blog to the navigation.", key: "enableBlog" },
              { label: "Maintenance mode", desc: "Show a maintenance banner site-wide.", key: "maintenanceMode" },
              { label: "Freelancer Mode", desc: "Toggle between Freelancer (shows Services) and Interview mode.", key: "freelancerMode" },
            ].map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
                <Switch
                  checked={!!(localSettings as any)[f.key]}
                  onCheckedChange={(val) => handleUpdate(f.key, val)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline">Export all content</Button>
            <Button variant="outline">Reset to defaults</Button>
            <Button variant="destructive">Delete all messages</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

