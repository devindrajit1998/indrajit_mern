import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Code2, Server, Palette, Zap, Database, Cloud } from "lucide-react";
import { services as mockServices } from "@/lib/portfolio-data";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

const iconMap: Record<string, any> = {
  Code2, Server, Palette, Zap, Database, Cloud
};

export const Route = createFileRoute("/admin/services")({
  component: AdminServices,
});

function AdminServices() {
  const { list: services, addOrUpdateItem, deleteItem } = useFirestoreCollection("services", mockServices);

  async function handleDelete(id: string) {
    try {
      await deleteItem(id);
      toast.success("Service deleted successfully");
    } catch (err) {
      toast.error("Failed to delete service");
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the services listed on your Services page."
        actions={
          <ServiceFormDialog
            onSave={addOrUpdateItem}
            trigger={<Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New service</Button>}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => {
          const Icon = iconMap[s.icon as any] || Code2;
          const id = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <Card key={s.title}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.desc}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <ServiceFormDialog
                    title="Edit service"
                    service={s}
                    onSave={addOrUpdateItem}
                    trigger={<Button variant="ghost" size="icon" title="Edit"><Pencil className="w-4 h-4" /></Button>}
                  />
                  <DeleteConfirmDialog
                    title="Delete service?"
                    description={`Are you sure you want to delete "${s.title}"?`}
                    onConfirm={() => handleDelete(id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ServiceFormDialog({
  trigger,
  title = "New service",
  service,
  onSave,
}: {
  trigger: React.ReactNode;
  title?: string;
  service?: any;
  onSave: (docId: string, itemData: any) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: service?.title || "",
    icon: service?.icon || "Code2",
    desc: service?.desc || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      const id = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await onSave(id, formData);
      toast.success("Service saved successfully");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Define a competency or freelance offering.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="Web Application Development"
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Icon Name (Lucide)</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={formData.icon}
                onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))}
              >
                <option value="Code2">Code2 (Frontend/Fullstack)</option>
                <option value="Server">Server (APIs)</option>
                <option value="Palette">Palette (UI/UX)</option>
                <option value="Zap">Zap (Optimization)</option>
                <option value="Database">Database (DB Admin)</option>
                <option value="Cloud">Cloud (DevOps)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                placeholder="Brief summary of this service..."
                value={formData.desc}
                onChange={(e) => setFormData(p => ({ ...p, desc: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save service</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
