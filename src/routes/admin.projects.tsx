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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, ExternalLink, Upload } from "lucide-react";
import { projects as mockProjects, type Project } from "@/lib/portfolio-data";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { uploadToImageKit } from "@/lib/imagekit.functions";
import { useServerFn } from "@tanstack/react-start";

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
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[240px]">{p.desc}</p>
                      </div>
                    </div>
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
                  <TableCell><Badge className="bg-brand-green/20 text-brand-green hover:bg-brand-green/20">Published</Badge></TableCell>
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
  const uploadFn = useServerFn(uploadToImageKit);
  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    role: project?.role || "",
    year: project?.year || "",
    desc: project?.desc || "",
    overview: project?.overview || "",
    liveUrl: project?.liveUrl || "",
    repoUrl: project?.repoUrl || "",
    tags: project?.tags.join(", ") || "",
    features: project?.features.join("\n") || "",
    img: project?.img || ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.slug || !formData.title) {
      toast.error("Title and slug are required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        features: formData.features.split("\n").map(f => f.trim()).filter(Boolean),
      };
      await onSave(formData.slug, payload);
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
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                placeholder="travel-explorer"
                value={formData.slug}
                disabled={!!project}
                onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                placeholder="Full-Stack Developer"
                value={formData.role}
                onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                placeholder="2025"
                value={formData.year}
                onChange={(e) => setFormData(p => ({ ...p, year: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Short description</Label>
              <Textarea
                rows={2}
                placeholder="One-line summary shown on the project card."
                value={formData.desc}
                onChange={(e) => setFormData(p => ({ ...p, desc: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Overview</Label>
              <Textarea
                rows={4}
                placeholder="Detailed overview shown in the project modal."
                value={formData.overview}
                onChange={(e) => setFormData(p => ({ ...p, overview: e.target.value }))}
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
            <div className="sm:col-span-2 space-y-2">
              <Label>Tech stack (comma separated)</Label>
              <Input
                placeholder="MongoDB, Express.js, React.js, Node.js"
                value={formData.tags}
                onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Key Features (one per line)</Label>
              <Textarea
                rows={3}
                placeholder="Search & filter destinations&#10;Secure JWT authentication"
                value={formData.features}
                onChange={(e) => setFormData(p => ({ ...p, features: e.target.value }))}
              />
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

