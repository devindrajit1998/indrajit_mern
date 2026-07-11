import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Upload, Trash2, Plus } from "lucide-react";
import { stats as mockStats } from "@/lib/portfolio-data";
import { useFirestoreDoc } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadToImageKit } from "@/lib/imagekit.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/admin/about")({
  component: AdminAbout,
});

function AdminAbout() {
  const { data: bio, updateDocData } = useFirestoreDoc("about", "personal_bio", {
    fullName: "Indrajit Ghosh",
    headline: "MERN Stack Developer",
    email: "hello@indrajit.dev",
    location: "Kolkata, India",
    shortBio: "Full-stack engineer specialising in the MERN stack, currently open to full-time roles.",
    longBio: "Detailed bio shown on the About page describing background, focus areas and interests.",
    stats: mockStats,
    avatarUrl: "",
    avatarBase64: "",
    resumeUrl: "",
    resumeBase64: "",
  });

  const uploadFn = useServerFn(uploadToImageKit);

  const [localBio, setLocalBio] = useState(bio);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bio) {
      setLocalBio(bio);
    }
  }, [bio]);

  async function handleSave() {
    setLoading(true);
    try {
      await updateDocData(localBio);
      toast.success("Bio and stats saved successfully");
    } catch (err) {
      toast.error("Failed to save bio details");
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate(field: string, value: any) {
    setLocalBio(prev => ({ ...prev, [field]: value }));
  }

  function handleUpdateStat(index: number, field: "value" | "label", val: string) {
    const updatedStats = [...(localBio.stats || [])];
    if (updatedStats[index]) {
      updatedStats[index] = { ...updatedStats[index], [field]: val };
      handleUpdate("stats", updatedStats);
    }
  }

  function handleAddStat() {
    const updatedStats = [...(localBio.stats || []), { value: "0", label: "New Stat Metric" }];
    handleUpdate("stats", updatedStats);
  }

  if (!localBio) return null;

  return (
    <div>
      <PageHeader
        title="About / Bio"
        description="Personal information, headline, and stats displayed across the site."
        actions={<Button size="sm" className="gap-2" onClick={handleSave} disabled={loading}><Save className="w-4 h-4" /> Save changes</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Personal info</CardTitle>
            <CardDescription>Shown in the hero and About page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={localBio.fullName || ""} onChange={(e) => handleUpdate("fullName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Headline</Label>
                <Input value={localBio.headline || ""} onChange={(e) => handleUpdate("headline", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={localBio.email || ""} onChange={(e) => handleUpdate("email", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={localBio.location || ""} onChange={(e) => handleUpdate("location", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={(localBio as any).phone || ""} placeholder="+91 98765 43210" onChange={(e) => handleUpdate("phone", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Short bio</Label>
              <Textarea rows={3} value={localBio.shortBio || ""} onChange={(e) => handleUpdate("shortBio", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Long bio</Label>
              <Textarea rows={6} value={localBio.longBio || ""} onChange={(e) => handleUpdate("longBio", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avatar & CV</CardTitle>
            <CardDescription>Profile image and downloadable resume.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Profile photo</Label>
              <div className="flex items-center gap-3">
                {localBio.avatarUrl || localBio.avatarBase64 ? (
                  <img
                    src={localBio.avatarBase64 || localBio.avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center font-display font-bold text-white text-2xl">
                    IG
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64 = reader.result as string;
                          const uploadToast = toast.loading("Uploading avatar to ImageKit...");
                          try {
                            const res = await uploadFn({ data: { fileBase64: base64, fileName: file.name } });
                            if (res.ok) {
                              handleUpdate("avatarUrl", res.url);
                              handleUpdate("avatarBase64", ""); // clear base64 to save database space
                              toast.success("Profile photo uploaded to ImageKit!", { id: uploadToast });
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
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </Button>
                  {(localBio.avatarUrl || localBio.avatarBase64) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => {
                        handleUpdate("avatarBase64", "");
                        handleUpdate("avatarUrl", "");
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Resume / CV (PDF)</Label>
              <input
                type="file"
                id="resume-upload"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File size must be under 5MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const base64 = reader.result as string;
                      const uploadToast = toast.loading("Uploading resume to ImageKit...");
                      try {
                        const res = await uploadFn({ data: { fileBase64: base64, fileName: file.name } });
                        if (res.ok) {
                          handleUpdate("resumeUrl", res.url);
                          handleUpdate("resumeBase64", ""); // clear base64 to save database space
                          toast.success("Resume uploaded to ImageKit!", { id: uploadToast });
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to upload resume", { id: uploadToast });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div
                className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-brand-purple/60 transition-colors cursor-pointer"
                onClick={() => document.getElementById("resume-upload")?.click()}
              >
                <Upload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">
                  {localBio.resumeUrl || localBio.resumeBase64 ? "✓ Resume loaded (PDF)" : "Upload resume.pdf"}
                </p>
                {(localBio.resumeUrl !== bio.resumeUrl || localBio.resumeBase64 !== bio.resumeBase64) && (localBio.resumeUrl || localBio.resumeBase64) && (
                  <p className="text-[10px] text-brand-purple mt-1">Ready to save</p>
                )}
                {localBio.resumeUrl === bio.resumeUrl && bio.resumeUrl && (
                  <p className="text-[10px] text-brand-green mt-1">✓ Saved to database</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Stats strip</CardTitle>
            <CardDescription>Metrics displayed in the About stats grid.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleAddStat}><Plus className="w-4 h-4" /> Add stat</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(localBio.stats || []).map((s: any, i: number) => (
            <div key={i} className="p-3 rounded-lg border border-border/60 space-y-2">
              <Input value={s.value} placeholder="Value" className="h-9 font-semibold" onChange={(e) => handleUpdateStat(i, "value", e.target.value)} />
              <Input value={s.label} placeholder="Label" className="h-9 text-xs" onChange={(e) => handleUpdateStat(i, "label", e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

