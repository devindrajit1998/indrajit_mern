import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, Search, BookOpen, ExternalLink, Sparkles, Upload, Loader2 } from "lucide-react";
import { mockBlogs, type BlogPost } from "@/lib/portfolio-data";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useServerFn } from "@tanstack/react-start";
import { uploadToImageKit } from "@/lib/imagekit.functions";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AdminBlogs() {
  const { list: blogs, addOrUpdateItem, deleteItem } = useFirestoreCollection<BlogPost>("blogs", mockBlogs);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function handleDelete(slug: string) {
    try {
      await deleteItem(slug);
      toast.success("Article deleted successfully");
    } catch (err) {
      toast.error("Failed to delete article");
    }
  }

  return (
    <div>
      <PageHeader
        title="Engineering Blog"
        description="Write, edit, and publish technical articles on your portfolio."
        actions={
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-9 h-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <BlogFormDialog
              onSave={addOrUpdateItem}
              trigger={<Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New article</Button>}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBlogs.map((b) => (
          <Card key={b.slug} className="glass-card overflow-hidden flex flex-col justify-between">
            <div>
              {b.coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden bg-black/40 border-b border-white/10">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/75 text-white/90 backdrop-blur-md border border-white/15">
                      {b.category}
                    </span>
                    {b.featured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-purple text-white shadow">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              )}

              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>{b.publishedAt || "Draft"}</span>
                  <span>{b.readTime || "5 min"}</span>
                </div>

                <h3 className="font-bold text-base line-clamp-2 text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{b.excerpt}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {(b.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10">
                      #{t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </div>

            <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${b.published !== false ? "bg-emerald-400" : "bg-zinc-500"}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {b.published !== false ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" asChild title="View public post">
                  <a href={`/blog/${b.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <BlogFormDialog
                  title="Edit article"
                  blog={b}
                  onSave={addOrUpdateItem}
                  trigger={<Button variant="ghost" size="icon" title="Edit"><Pencil className="w-4 h-4" /></Button>}
                />
                <DeleteConfirmDialog
                  title="Delete article?"
                  description={`Are you sure you want to delete "${b.title}"?`}
                  onConfirm={() => handleDelete(b.slug)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BlogFormDialog({
  trigger,
  title = "New article",
  blog,
  onSave,
}: {
  trigger: React.ReactNode;
  title?: string;
  blog?: BlogPost;
  onSave: (docId: string, itemData: any) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadFn = useServerFn(uploadToImageKit);

  const [formData, setFormData] = useState<BlogPost>({
    slug: blog?.slug || "",
    title: blog?.title || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    coverImage: blog?.coverImage || "",
    category: blog?.category || "Full-Stack Development",
    tags: blog?.tags || ["React", "Node.js"],
    readTime: blog?.readTime || "5 min read",
    publishedAt: blog?.publishedAt || new Date().toISOString().split("T")[0],
    published: blog?.published ?? true,
    featured: blog?.featured ?? false,
  });

  const [tagInput, setTagInput] = useState("");

  function handleTitleChange(val: string) {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: blog ? prev.slug : slugify(val),
    }));
  }

  function handleAddTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  }

  function handleRemoveTag(tag: string) {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading cover image to ImageKit...");
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await uploadFn({
          data: {
            fileBase64: base64,
            fileName: file.name,
            folder: "/blog",
          },
        });

        if (res?.url) {
          setFormData((p) => ({ ...p, coverImage: res.url }));
          toast.success("Cover image uploaded!", { id: toastId });
        } else {
          toast.error("Upload failed", { id: toastId });
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error("Upload error: " + (err?.message || "Failed to upload"), { id: toastId });
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const finalSlug = formData.slug.trim() || slugify(formData.title);

    setLoading(true);
    try {
      await onSave(finalSlug, {
        ...formData,
        slug: finalSlug,
      });
      toast.success("Article saved successfully!");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to save article");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </div>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Publish or edit an engineering article for your portfolio blog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Article Title</Label>
            <Input
              placeholder="e.g. Architecting Scalable MERN Apps"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Slug (URL path)</Label>
              <Input
                placeholder="e.g. architecting-scalable-mern-apps"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                placeholder="e.g. Full-Stack Development"
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Estimated Read Time</Label>
              <Input
                placeholder="e.g. 5 min read"
                value={formData.readTime}
                onChange={(e) => setFormData((p) => ({ ...p, readTime: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Publish Date</Label>
              <Input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData((p) => ({ ...p, publishedAt: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Short Summary / Excerpt</Label>
            <Textarea
              rows={2}
              placeholder="A brief 1-2 sentence overview shown on blog index cards..."
              value={formData.excerpt}
              onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Cover Image URL</Label>
              <label className="text-xs text-brand-purple cursor-pointer hover:underline inline-flex items-center gap-1 font-medium">
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                <span>Upload to ImageKit</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <Input
              placeholder="https://..."
              value={formData.coverImage}
              onChange={(e) => setFormData((p) => ({ ...p, coverImage: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag and press enter (e.g. React, Docker)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.tags.map((t) => (
                <span
                  key={t}
                  onClick={() => handleRemoveTag(t)}
                  className="text-xs px-2.5 py-1 rounded-md bg-brand-purple/15 text-brand-purple border border-brand-purple/30 cursor-pointer hover:bg-brand-purple/25"
                  title="Click to remove"
                >
                  #{t} ✕
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Article Markdown Content</Label>
            <Textarea
              rows={8}
              placeholder={`## Section Title\n\nWrite your technical article here in markdown...\n\n\`\`\`javascript\nconst code = "example";\n\`\`\``}
              value={formData.content}
              onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
              className="font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="text-xs font-semibold">Published</p>
              <p className="text-[10px] text-muted-foreground">Make article visible on the public /blog page</p>
            </div>
            <Switch
              checked={formData.published}
              onCheckedChange={(val) => setFormData((p) => ({ ...p, published: val }))}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="text-xs font-semibold">Featured Article</p>
              <p className="text-[10px] text-muted-foreground">Display at the top of /blog as the spotlight hero</p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={(val) => setFormData((p) => ({ ...p, featured: val }))}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
