import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Github, Linkedin, Twitter, Mail, Globe, Sparkles, KeyRound, ExternalLink } from "lucide-react";
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
    showResume: false,
    availabilityText: "Available for Freelance & Contract Projects",
    enableBlog: false,
    maintenanceMode: false,
    freelancerMode: true,
    geminiApiKey: "",
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
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <Label className="text-xs font-semibold">Availability Badge Text</Label>
              <Input
                placeholder="e.g. Available for Freelance & Contract Projects"
                value={localSettings.availabilityText || ""}
                onChange={(e) => handleUpdate("availabilityText", e.target.value)}
                className="h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Text displayed on the pulsing green badge on the hero photo.
              </p>
            </div>

            {[
              { label: "Freelancer Mode (Recommended)", desc: "Showcase freelance services, client testimonials, and project inquiry CTAs.", key: "freelancerMode" },
              { label: "Show Availability Badge", desc: "Displays pulsing availability badge on the hero image.", key: "showOpenToWork" },
              { label: "Show Resume Download", desc: "Show Resume/CV download buttons on header, hero and about pages.", key: "showResume" },
              { label: "Enable contact form", desc: "Show the contact form on /contact.", key: "enableContactForm" },
              { label: "Enable blog section", desc: "Adds /blog to the navigation.", key: "enableBlog" },
              { label: "Maintenance mode", desc: "Show a maintenance banner site-wide.", key: "maintenanceMode" },
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

        <Card className="lg:col-span-2 border-brand-purple/40 bg-gradient-to-br from-brand-purple/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-purple/20 text-brand-purple">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Google AI Studio (Gemini Integration)</CardTitle>
                  <CardDescription>
                    Power one-click AI generation for project descriptions, key impact metrics, and portfolio copywriting.
                  </CardDescription>
                </div>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-brand-purple hover:underline"
              >
                Get free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <KeyRound className="w-3.5 h-3.5 text-muted-foreground" /> Google AI Studio API Key
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={localSettings.geminiApiKey || ""}
                  onChange={(e) => handleUpdate("geminiApiKey", e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Your API key is securely saved in site settings. You can generate one for free at{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-purple hover:underline"
                >
                  aistudio.google.com/app/apikey
                </a>.
              </p>
            </div>
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

