import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Copy, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useServerFn } from "@tanstack/react-start";
import { uploadToImageKit } from "@/lib/imagekit.functions";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function AdminMedia() {
  const { list: mediaItems, loading: mediaLoading, addOrUpdateItem, deleteItem } = useFirestoreCollection<any>("media_library", []);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadFn = useServerFn(uploadToImageKit);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadToast = toast.loading(`Uploading ${file.name} to ImageKit...`);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await uploadFn({ data: { fileBase64: base64, fileName: file.name } });
        const docId = `media-${Date.now()}`;
        await addOrUpdateItem(docId, {
          src: res.url,
          name: file.name,
          size: formatBytes(file.size),
          uploadedAt: new Date().toISOString()
        });
        toast.success("Image uploaded successfully!", { id: uploadToast });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred during upload", { id: uploadToast });
      } finally {
        setUploading(false);
      }
    };
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  }

  async function handleDelete(id: string) {
    const deleteToast = toast.loading("Deleting file...");
    try {
      await deleteItem(id);
      toast.success("File deleted successfully", { id: deleteToast });
    } catch (err) {
      toast.error("Failed to delete file", { id: deleteToast });
    }
  }

  const filteredItems = mediaItems.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Input
        type="file"
        id="media-file-input"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <PageHeader
        title="Media Library"
        description="Uploaded images used across projects and content."
        actions={
          <>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search files…" 
                className="pl-9 h-9 w-56" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              size="sm" 
              className="gap-2" 
              onClick={() => document.getElementById("media-file-input")?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </Button>
          </>
        }
      />

      {mediaLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-video glass-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-lg">No media found</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload images to use them across your projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((f: any) => (
            <Card key={f.id} className="group overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img src={f.src} alt={f.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8"
                    onClick={() => handleCopy(f.src)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8"
                    onClick={() => handleDelete(f.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium truncate" title={f.name}>{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.size}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
