import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Star,
  Quote,
  MessageSquareQuote,
  Upload,
  Calendar,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { testimonials as defaultTestimonials, type Testimonial } from "@/lib/portfolio-data";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useServerFn } from "@tanstack/react-start";
import { uploadToImageKit } from "@/lib/imagekit.functions";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonials,
});

function AdminTestimonials() {
  const { list: testimonials, addOrUpdateItem, deleteItem, loading } = useFirestoreCollection<Testimonial>(
    "testimonials",
    defaultTestimonials
  );

  async function handleDelete(id: string, name: string) {
    try {
      await deleteItem(id);
      toast.success(`Deleted testimonial from ${name}`);
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Testimonials"
        description="Manage customer feedback, ratings, and reviews shown on your website."
        actions={
          <TestimonialFormDialog
            onSave={addOrUpdateItem}
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Testimonial
              </Button>
            }
          />
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 glass-card animate-pulse rounded-xl" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-border/80">
          <MessageSquareQuote className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-lg">No testimonials added yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-sm mx-auto">
            Add your client feedback with customer name, photo, star rating, and date.
          </p>
          <TestimonialFormDialog
            onSave={addOrUpdateItem}
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Testimonial
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => {
            const id = t.id || `testimonial-${idx}`;
            return (
              <Card
                key={id}
                className="group border border-border/70 hover:border-brand-purple/50 transition-all duration-300 shadow-sm bg-card/60 backdrop-blur-sm rounded-xl flex flex-col justify-between"
              >
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div>
                    {/* Header: Customer Photo + Name + Edit/Delete */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-brand-purple/40 shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-brand-purple/15 text-brand-purple font-semibold flex items-center justify-center text-sm border-2 border-brand-purple/30 shrink-0">
                            {t.name ? t.name.substring(0, 2).toUpperCase() : "CU"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm leading-tight truncate">{t.name}</h3>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>{t.date || "Recent"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <TestimonialFormDialog
                          title="Edit Testimonial"
                          testimonial={t}
                          onSave={addOrUpdateItem}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          }
                        />
                        <DeleteConfirmDialog
                          title="Delete testimonial?"
                          description={`Are you sure you want to delete the testimonial from "${t.name}"?`}
                          onConfirm={() => handleDelete(id, t.name)}
                        />
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-3.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (t.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-muted-foreground ml-1">
                        {(t.rating || 5)}.0
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2.5 italic line-clamp-4">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Quote className="w-3 h-3 text-brand-purple" /> Review
                    </span>
                    {t.featured !== false ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Visible on Home
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">Hidden</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TestimonialFormDialog({
  trigger,
  title = "Add Testimonial",
  testimonial,
  onSave,
}: {
  trigger: React.ReactNode;
  title?: string;
  testimonial?: Testimonial;
  onSave: (docId: string, itemData: any) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFn = useServerFn(uploadToImageKit);

  const [formData, setFormData] = useState<Testimonial>({
    name: testimonial?.name || "",
    rating: testimonial?.rating || 5,
    date: testimonial?.date || new Date().toISOString().split("T")[0],
    avatar: testimonial?.avatar || "",
    quote: testimonial?.quote || "",
    featured: testimonial?.featured ?? true,
  });

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadToast = toast.loading("Uploading customer photo...");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await uploadFn({ data: { fileBase64: base64, fileName: file.name } });
        if (res.ok) {
          setFormData((p) => ({ ...p, avatar: res.url }));
          toast.success("Photo uploaded successfully!", { id: uploadToast });
        } else {
          toast.error("Upload failed", { id: uploadToast });
        }
      } catch (err) {
        toast.error("Error uploading image", { id: uploadToast });
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!formData.quote.trim()) {
      toast.error("Review quote is required");
      return;
    }

    setLoading(true);
    try {
      const docId =
        testimonial?.id ||
        `t-${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
      await onSave(docId, { ...formData, id: docId });
      toast.success("Testimonial saved successfully!");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter the customer review details below.
            </DialogDescription>
          </DialogHeader>

          {/* Customer Photo Upload & Preview */}
          <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center gap-3">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-purple shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Customer Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" /> Upload Photo
                    </>
                  )}
                </Button>
              </div>
              <Input
                placeholder="Or paste image URL"
                value={formData.avatar}
                onChange={(e) => setFormData((p) => ({ ...p, avatar: e.target.value }))}
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Customer Name *</Label>
            <Input
              placeholder="e.g. Arijit Dutta"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              className="h-9"
            />
          </div>

          {/* Rating & Adding Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Rating *</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={formData.rating || 5}
                onChange={(e) => setFormData((p) => ({ ...p, rating: Number(e.target.value) }))}
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                className="h-9"
                required
              />
            </div>
          </div>

          {/* Review Quote */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Customer Review / Feedback *</Label>
            <Textarea
              rows={4}
              placeholder="Enter customer feedback or testimonial..."
              value={formData.quote}
              onChange={(e) => setFormData((p) => ({ ...p, quote: e.target.value }))}
              required
              className="resize-none text-sm"
            />
          </div>

          {/* Display on homepage toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={formData.featured ?? true}
              onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 rounded border-border text-brand-purple focus:ring-brand-purple"
            />
            <Label htmlFor="featured-checkbox" className="text-xs font-medium cursor-pointer">
              Show on Homepage
            </Label>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingImage} className="btn-glow">
              {loading ? "Saving..." : "Save Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

