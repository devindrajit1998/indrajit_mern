import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Briefcase, Save } from "lucide-react";
import { experience as mockExperience } from "@/lib/portfolio-data";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export const Route = createFileRoute("/admin/experience")({
  component: AdminExperience,
});

function AdminExperience() {
  const { list: experience, addOrUpdateItem, deleteItem } = useFirestoreCollection("experience", mockExperience);
  const [localExp, setLocalExp] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (experience) {
      setLocalExp(experience);
    }
  }, [experience]);

  function handleUpdateField(index: number, field: string, val: string) {
    setLocalExp(prev => prev.map((e, idx) => idx === index ? { ...e, [field]: val } : e));
  }

  async function handleSaveAll() {
    setLoading(true);
    try {
      for (const e of localExp) {
        const id = e.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await addOrUpdateItem(id, {
          title: e.title,
          company: e.company,
          date: e.date,
          color: e.color || "text-brand-blue",
          desc: e.desc
        });
      }
      toast.success("Experience timeline saved successfully");
    } catch (err) {
      toast.error("Failed to save experience timeline");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(company: string) {
    try {
      const id = company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await deleteItem(id);
      setLocalExp(prev => prev.filter(e => e.company !== company));
      toast.success("Experience entry deleted");
    } catch (err) {
      toast.error("Failed to delete experience entry");
    }
  }

  function handleAddEntry() {
    const defaultCompany = `New Company ${localExp.length + 1}`;
    setLocalExp([...localExp, {
      title: "Software Engineer",
      company: defaultCompany,
      date: "Jan 2026 - Present",
      color: "text-brand-blue",
      desc: "Describe your work here..."
    }]);
  }

  return (
    <div>
      <PageHeader
        title="Experience Timeline"
        description="Manage the work history entries shown on the About page."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={handleAddEntry}><Plus className="w-4 h-4" /> Add entry</Button>
            <Button size="sm" className="gap-2" onClick={handleSaveAll} disabled={loading}><Save className="w-4 h-4" /> Save all</Button>
          </div>
        }
      />

      <div className="space-y-4">
        {localExp.map((e, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{e.title}</h3>
                  <p className="text-xs text-muted-foreground">{e.company} · {e.date}</p>
                </div>
                <DeleteConfirmDialog
                  title="Delete experience entry?"
                  description={`Are you sure you want to delete the experience timeline entry for "${e.company}"?`}
                  onConfirm={() => handleDelete(e.company)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Job title</Label>
                  <Input value={e.title} onChange={(evt) => handleUpdateField(i, "title", evt.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company</Label>
                  <Input value={e.company} onChange={(evt) => handleUpdateField(i, "company", evt.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Date range</Label>
                  <Input value={e.date} onChange={(evt) => handleUpdateField(i, "date", evt.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Accent color</Label>
                  <Input value={e.color || ""} placeholder="text-brand-blue" onChange={(evt) => handleUpdateField(i, "color", evt.target.value)} className="h-9" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea rows={2} value={e.desc} onChange={(evt) => handleUpdateField(i, "desc", evt.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

