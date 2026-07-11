import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save, GraduationCap, FileCheck, Trophy, Medal, Award } from "lucide-react";
import { qualifications as mockQuals, certifications as mockCerts, awards as mockAwards } from "@/lib/portfolio-data";
import { useFirestoreDoc } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/credentials")({
  component: AdminCredentials,
});

const iconMap: Record<string, any> = {
  GraduationCap, FileCheck, Trophy, Medal, Award,
};

// ── Generic editable row ─────────────────────────────────────────
function Row({
  icon: Icon,
  title,
  subtitle,
  meta,
  onEdit,
  onDelete,
}: {
  icon: any;
  title: string;
  subtitle: string;
  meta?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}{meta ? ` · ${meta}` : ""}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
    </div>
  );
}

// ── Qualification dialog ─────────────────────────────────────────
function QualDialog({
  trigger,
  initial,
  onSave,
}: {
  trigger: React.ReactNode;
  initial?: any;
  onSave: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ degree: "", institution: "", year: "", grade: "", ...initial });

  useEffect(() => { if (open) setForm({ degree: "", institution: "", year: "", grade: "", ...initial }); }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{initial ? "Edit Qualification" : "Add Qualification"}</DialogTitle></DialogHeader>
        <div className="space-y-3 my-4">
          <div className="space-y-1.5"><Label>Degree / Program</Label><Input value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))} placeholder="B.Tech Computer Science" /></div>
          <div className="space-y-1.5"><Label>Institution</Label><Input value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="IIT Delhi" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Year</Label><Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2022" /></div>
            <div className="space-y-1.5"><Label>Grade / CGPA</Label><Input value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} placeholder="CGPA 8.5" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (form.degree && form.institution) { onSave(form); setOpen(false); } else toast.error("Degree and institution are required"); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Certification dialog ─────────────────────────────────────────
function CertDialog({
  trigger,
  initial,
  onSave,
}: {
  trigger: React.ReactNode;
  initial?: any;
  onSave: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ title: "", provider: "", year: "", credential: "", ...initial });

  useEffect(() => { if (open) setForm({ title: "", provider: "", year: "", credential: "", ...initial }); }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{initial ? "Edit Certification" : "Add Certification"}</DialogTitle></DialogHeader>
        <div className="space-y-3 my-4">
          <div className="space-y-1.5"><Label>Certification Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="AWS Solutions Architect" /></div>
          <div className="space-y-1.5"><Label>Provider</Label><Input value={form.provider} onChange={e => setForm(p => ({ ...p, provider: e.target.value }))} placeholder="Amazon Web Services" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Year</Label><Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2024" /></div>
            <div className="space-y-1.5"><Label>Credential ID</Label><Input value={form.credential} onChange={e => setForm(p => ({ ...p, credential: e.target.value }))} placeholder="ID: ABC123" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (form.title && form.provider) { onSave(form); setOpen(false); } else toast.error("Title and provider are required"); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Award dialog ─────────────────────────────────────────────────
function AwardDialog({
  trigger,
  initial,
  onSave,
}: {
  trigger: React.ReactNode;
  initial?: any;
  onSave: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ title: "", event: "", desc: "", icon: "Trophy", ...initial });

  useEffect(() => { if (open) setForm({ title: "", event: "", desc: "", icon: "Trophy", ...initial }); }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{initial ? "Edit Award" : "Add Award"}</DialogTitle></DialogHeader>
        <div className="space-y-3 my-4">
          <div className="space-y-1.5"><Label>Award Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="1st Place — National Hackathon" /></div>
          <div className="space-y-1.5"><Label>Event / Organizer</Label><Input value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} placeholder="Google DevFest 2024" /></div>
          <div className="space-y-1.5"><Label>Icon (Trophy / Medal / Award)</Label><Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="Trophy" /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Brief description of the achievement." /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (form.title && form.event) { onSave(form); setOpen(false); } else toast.error("Title and event are required"); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main admin page ──────────────────────────────────────────────
function AdminCredentials() {
  const { data: creds, updateDocData } = useFirestoreDoc("credentials", "portfolio_credentials", {
    qualifications: mockQuals,
    certifications: mockCerts,
    awards: mockAwards,
  });

  const [activeTab, setActiveTab] = useState("qualifications");
  const [loading, setLoading] = useState(false);

  const [quals, setQuals] = useState<any[]>(mockQuals);
  const [certs, setCerts] = useState<any[]>(mockCerts);
  const [awards, setAwards] = useState<any[]>(mockAwards);

  useEffect(() => {
    if (creds) {
      setQuals(creds.qualifications || []);
      setCerts(creds.certifications || []);
      setAwards(creds.awards || []);
    }
  }, [creds]);

  async function handleSave() {
    setLoading(true);
    try {
      await updateDocData({
        qualifications: quals.map(q => ({ ...q, icon: "GraduationCap" })),
        certifications: certs.map(c => ({ ...c, icon: "FileCheck" })),
        awards: awards.map(a => ({ ...a, icon: a.icon || "Trophy" })),
      });
      toast.success("Credentials updated successfully");
    } catch (err) {
      toast.error("Failed to save credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Credentials"
        description="Manage qualifications, certifications, and awards shown on the About page."
        actions={
          <Button size="sm" className="gap-2" onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4" /> Save all
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="qualifications">Qualifications ({quals.length})</TabsTrigger>
          <TabsTrigger value="certifications">Certifications ({certs.length})</TabsTrigger>
          <TabsTrigger value="awards">Awards ({awards.length})</TabsTrigger>
        </TabsList>

        {/* ── Qualifications tab ── */}
        <TabsContent value="qualifications">
          <div className="flex justify-end mb-3">
            <QualDialog
              trigger={<Button size="sm" variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Add qualification</Button>}
              onSave={(data) => setQuals([...quals, data])}
            />
          </div>
          <Card>
            <CardContent className="p-4 space-y-2">
              {quals.map((q, i) => (
                <Row
                  key={i}
                  icon={GraduationCap}
                  title={q.degree}
                  subtitle={q.institution}
                  meta={`${q.year} · ${q.grade}`}
                  onEdit={() => {}}
                  onDelete={() => setQuals(quals.filter((_, idx) => idx !== i))}
                />
              ))}
              {quals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No qualifications yet. Add one above.</p>
              )}
            </CardContent>
          </Card>
          {/* Inline edit rows for qualifications */}
          <div className="mt-4 space-y-3">
            {quals.map((q, i) => (
              <Card key={i}>
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Degree</Label><Input value={q.degree} onChange={e => setQuals(quals.map((x, idx) => idx === i ? { ...x, degree: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Institution</Label><Input value={q.institution} onChange={e => setQuals(quals.map((x, idx) => idx === i ? { ...x, institution: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Year</Label><Input value={q.year} onChange={e => setQuals(quals.map((x, idx) => idx === i ? { ...x, year: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Grade / CGPA</Label><Input value={q.grade} onChange={e => setQuals(quals.map((x, idx) => idx === i ? { ...x, grade: e.target.value } : x))} className="h-9" /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Certifications tab ── */}
        <TabsContent value="certifications">
          <div className="flex justify-end mb-3">
            <CertDialog
              trigger={<Button size="sm" variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Add certification</Button>}
              onSave={(data) => setCerts([...certs, data])}
            />
          </div>
          <div className="space-y-3">
            {certs.map((c, i) => (
              <Card key={i}>
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={c.title} onChange={e => setCerts(certs.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Provider</Label><Input value={c.provider} onChange={e => setCerts(certs.map((x, idx) => idx === i ? { ...x, provider: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Year</Label><Input value={c.year} onChange={e => setCerts(certs.map((x, idx) => idx === i ? { ...x, year: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Credential ID</Label><Input value={c.credential} onChange={e => setCerts(certs.map((x, idx) => idx === i ? { ...x, credential: e.target.value } : x))} className="h-9" /></div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1" onClick={() => setCerts(certs.filter((_, idx) => idx !== i))}>
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No certifications yet. Add one above.</p>
            )}
          </div>
        </TabsContent>

        {/* ── Awards tab ── */}
        <TabsContent value="awards">
          <div className="flex justify-end mb-3">
            <AwardDialog
              trigger={<Button size="sm" variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Add award</Button>}
              onSave={(data) => setAwards([...awards, data])}
            />
          </div>
          <div className="space-y-3">
            {awards.map((a, i) => (
              <Card key={i}>
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Award Title</Label><Input value={a.title} onChange={e => setAwards(awards.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Event</Label><Input value={a.event} onChange={e => setAwards(awards.map((x, idx) => idx === i ? { ...x, event: e.target.value } : x))} className="h-9" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Icon (Trophy / Medal / Award)</Label><Input value={a.icon || "Trophy"} onChange={e => setAwards(awards.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x))} className="h-9" /></div>
                  <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs">Description</Label><Textarea rows={2} value={a.desc} onChange={e => setAwards(awards.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} /></div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1" onClick={() => setAwards(awards.filter((_, idx) => idx !== i))}>
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {awards.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No awards yet. Add one above.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
