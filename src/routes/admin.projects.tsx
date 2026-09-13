import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, ExternalLink, Upload, Check, X, Sparkles, Loader2, Zap } from "lucide-react";
import { projects as mockProjects, techStack as mockTechStack, type Project } from "@/lib/portfolio-data";
import { useFirestoreCollection, useFirestoreDoc } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { uploadToImageKit } from "@/lib/imagekit.functions";
import { generateProjectAI } from "@/lib/gemini.functions";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "@/lib/utils";

const DEFAULT_ROLES = [
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "MERN Stack Developer",
  "Software Engineer",
  "Frontend & Firebase Developer",
  "React.js Developer",
  "Node.js Developer",
  "Lead Developer",
  "UI/UX Engineer",
];

const DEFAULT_CATEGORIES = [
  "Full-Stack Web App",
  "SaaS & Dashboard",
  "E-Commerce",
  "Client / Freelance Project",
  "AI & Automation",
  "API & Microservice",
  "Mobile-Responsive Web App",
];

const DEFAULT_STATUSES = [
  "Live / In Production",
  "Completed",
  "In Development",
];

const DEFAULT_TECH_STACK = [
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Redux Toolkit",
  "Firebase",
  "Firestore",
  "REST APIs",
  "HTML5",
  "CSS3",
  "Git",
  "GitHub",
  "Postman",
  "JWT",
  "Socket.io",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  const { list: projects, addOrUpdateItem, deleteItem } = useFirestoreCollection("projects", mockProjects);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete(slug: string) {
    try {
      await deleteItem(slug);
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Create, update and organise the projects shown on your portfolio."
        actions={
          <>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects…"
                className="pl-9 h-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ProjectFormDialog
              onSave={addOrUpdateItem}
              trigger={<Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New project</Button>}
            />
          </>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[320px]">Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((p) => (
                <TableRow key={p.slug}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p.img && <img src={p.img} alt="" className="w-12 h-12 rounded object-cover" />}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-sm truncate">{p.title}</p>
                          {p.featured !== false && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-brand-purple/40 text-brand-purple">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[240px]">{p.desc}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {p.category || "Full-Stack Web App"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                      {p.tags.length > 3 && <span className="text-xs text-muted-foreground">+{p.tags.length - 3}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.year}</TableCell>
                  <TableCell>
                    <Badge className="bg-brand-green/20 text-brand-green hover:bg-brand-green/20">
                      {p.status || "Published"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Preview" asChild>
                        <a href={`/projects`}><ExternalLink className="w-4 h-4" /></a>
                      </Button>
                      <ProjectFormDialog
                        title="Edit project"
                        project={p}
                        onSave={addOrUpdateItem}
                        trigger={<Button variant="ghost" size="icon" title="Edit"><Pencil className="w-4 h-4" /></Button>}
                      />
                      <DeleteConfirmDialog
                        title="Delete project?"
                        description={`Are you sure you want to delete "${p.title}"? This will permanently remove it from your portfolio.`}
                        onConfirm={() => handleDelete(p.slug)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectFormDialog({
  trigger,
  title = "New project",
  project,
  onSave,
}: {
  trigger: React.ReactNode;
  title?: string;
  project?: Project;
  onSave: (docId: string, itemData: any) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const uploadFn = useServerFn(uploadToImageKit);
  const generateAIFn = useServerFn(generateProjectAI);

  const { data: skillsDoc } = useFirestoreDoc<any>("skills", "portfolio_skills", {
    techStack: mockTechStack,
  });
  const { data: settings } = useFirestoreDoc<any>("settings", "site_settings");

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    role: project?.role || DEFAULT_ROLES[0],
    category: project?.category || DEFAULT_CATEGORIES[0],
    status: project?.status || DEFAULT_STATUSES[0],
    year: project?.year || new Date().getFullYear().toString(),
    desc: project?.desc || "",
    impact: project?.impact || "",
    featured: project?.featured ?? true,
    liveUrl: project?.liveUrl || "",
    repoUrl: project?.repoUrl || "",
    tags: project?.tags || [],
    img: project?.img || "",
  });

  const [customTagInput, setCustomTagInput] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({
        title: project?.title || "",
        slug: project?.slug || (project?.title ? slugify(project.title) : ""),
        role: project?.role || DEFAULT_ROLES[0],
        category: project?.category || DEFAULT_CATEGORIES[0],
        status: project?.status || DEFAULT_STATUSES[0],
        year: project?.year || new Date().getFullYear().toString(),
        desc: project?.desc || "",
        impact: project?.impact || "",
        featured: project?.featured ?? true,
        liveUrl: project?.liveUrl || "",
        repoUrl: project?.repoUrl || "",
        tags: project?.tags || [],
        img: project?.img || "",
      });
      setCustomTagInput("");
    }
  }, [open, project]);

  const availableRoles = Array.from(new Set([formData.role, ...DEFAULT_ROLES])).filter(Boolean);
  const availableCategories = Array.from(new Set([formData.category, ...DEFAULT_CATEGORIES])).filter(Boolean);
  const availableStatuses = Array.from(new Set([formData.status, ...DEFAULT_STATUSES])).filter(Boolean);

  const availableTechStack = Array.from(
    new Set([
      ...(skillsDoc?.techStack || []),
      ...DEFAULT_TECH_STACK,
      ...formData.tags,
    ])
  ).filter(Boolean);

  function toggleTag(tag: string) {
    setFormData((p) => {
      const exists = p.tags.includes(tag);
      return {
        ...p,
        tags: exists ? p.tags.filter((t) => t !== tag) : [...p.tags, tag],
      };
    });
  }

  function handleAddCustomTag() {
    const trimmed = customTagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((p) => ({ ...p, tags: [...p.tags, trimmed] }));
      setCustomTagInput("");
    }
  }

  async function handleAIGenerate() {
    if (!formData.title.trim()) {
      toast.error("Please enter a project title first");
      return;
    }
    setGeneratingAI(true);
    const toastId = toast.loading("Generating content with Google AI...");
    try {
      const res = await generateAIFn({
        data: {
          title: formData.title,
          role: formData.role,
          category: formData.category,
          techStack: formData.tags,
          apiKey: settings?.geminiApiKey,
        },
      });
      if (res.ok) {
        setFormData((p) => ({
          ...p,
          desc: res.desc || p.desc,
          impact: res.impact || p.impact,
        }));
        toast.success("✨ Project details generated with Google AI!", { id: toastId });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate AI content", { id: toastId });
    } finally {
      setGeneratingAI(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    const finalSlug = formData.slug.trim() || slugify(formData.title);
    if (!finalSlug) {
      toast.error("Slug is required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        slug: finalSlug,
        overview: formData.desc,
        features: [],
      };
      await onSave(finalSlug, payload);
      toast.success("Project saved successfully");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Fill in the project details. Changes will be visible on the public site once saved.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Cover Image URL</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="project-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64 = reader.result as string;
                          const uploadToast = toast.loading("Uploading image to ImageKit...");
                          try {
                            const res = await uploadFn({ data: { fileBase64: base64, fileName: file.name } });
                            if (res.ok) {
                              setFormData(p => ({ ...p, img: res.url }));
                              toast.success("Cover image uploaded to ImageKit!", { id: uploadToast });
                            }
                          } catch (err) {
                            console.error(err);
                            toast.error("Failed to upload image", { id: uploadToast });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs h-7 py-0 px-2"
                    onClick={() => document.getElementById("project-image-upload")?.click()}
                  >
                    <Upload className="w-3 h-3" /> Upload to ImageKit
                  </Button>
                </div>
              </div>
              <Input
                placeholder="https://..."
                value={formData.img}
                onChange={(e) => setFormData(p => ({ ...p, img: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Travel Explorer"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData((p) => ({
                    ...p,
                    title: newTitle,
                    ...(!project ? { slug: slugify(newTitle) } : {}),
                  }));
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Slug</Label>
                <span className="text-[10px] text-muted-foreground">
                  {project ? "Locked" : "Auto-generated from title"}
                </span>
              </div>
              <Input
                placeholder="travel-explorer"
                value={formData.slug}
                disabled={!!project}
                onChange={(e) => setFormData(p => ({ ...p, slug: slugify(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData((p) => ({ ...p, role: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                placeholder="2026"
                value={formData.year}
                onChange={(e) => setFormData(p => ({ ...p, year: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Category / Project Type</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData((p) => ({ ...p, category: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Short description</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs h-7 px-2.5 border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10"
                  onClick={handleAIGenerate}
                  disabled={generatingAI}
                >
                  {generatingAI ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                  )}
                  Generate with Google AI
                </Button>
              </div>
              <Textarea
                rows={3}
                placeholder="One-line summary shown on the project card."
                value={formData.desc}
                onChange={(e) => setFormData((p) => ({ ...p, desc: e.target.value }))}
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key Impact / Metric (Optional)</Label>
                <span className="text-[11px] text-muted-foreground">Shown as a highlight badge on the card</span>
              </div>
              <div className="relative">
                <Zap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-purple" />
                <Input
                  placeholder="e.g. 30% faster load times • Real-time ordering & auth"
                  value={formData.impact}
                  onChange={(e) => setFormData((p) => ({ ...p, impact: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="sm:col-span-2 p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold cursor-pointer">Featured Project</Label>
                <p className="text-[11px] text-muted-foreground">
                  Displays the Featured pill badge on cards and showcases this project on the homepage.
                </p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(val) => setFormData((p) => ({ ...p, featured: val }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Live URL</Label>
              <Input
                placeholder="https://…"
                value={formData.liveUrl}
                onChange={(e) => setFormData(p => ({ ...p, liveUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Repository URL</Label>
              <Input
                placeholder="https://github.com/…"
                value={formData.repoUrl}
                onChange={(e) => setFormData(p => ({ ...p, repoUrl: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label>Tech Stack</Label>
                <span className="text-xs text-muted-foreground">{formData.tags.length} selected</span>
              </div>

              {formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-border/60 bg-muted/20 min-h-[42px] items-center">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 bg-brand-purple/20 text-brand-purple border border-brand-purple/40 text-xs px-2.5 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:text-foreground ml-0.5 inline-flex items-center"
                        title={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No tech stack selected yet. Click options below to add.</p>
              )}

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Select from available Tech Stack:</p>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-md border border-border/50 bg-background/50">
                  {availableTechStack.map((tech) => {
                    const isSelected = formData.tags.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTag(tech)}
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer inline-flex items-center gap-1.5 select-none",
                          isSelected
                            ? "bg-brand-purple text-white border-brand-purple shadow-sm font-medium"
                            : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted/80 hover:text-foreground"
                        )}
                      >
                        {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-60" />}
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Input
                  placeholder="Add other tech (e.g. Next.js, Redux)..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddCustomTag}
                  className="h-8 text-xs px-3"
                  disabled={!customTagInput.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

