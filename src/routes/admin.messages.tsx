import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search, Reply, Trash2, Archive } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

const mockMessages = [
  { name: "Sarah Lin", email: "sarah@technova.io", subject: "MERN role at TechNova", preview: "Hi Indrajit, we're hiring for a senior full-stack role and your profile looks great…", time: "2h ago", unread: true },
];

function AdminMessages() {
  const { list: messages, deleteItem } = useFirestoreCollection("contact_messages", mockMessages);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = (messages as any[]).filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.message && m.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function handleDelete(id: any) {
    try {
      await deleteItem(id);
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    }
  }

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        description="Inquiries submitted through the Contact form."
        actions={
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages…"
              className="pl-9 h-9 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
      />

      <Card>
        <CardContent className="p-0 divide-y divide-border/60">
          {filteredMessages.map((m: any, i) => (
            <div key={m.id || i} className={`flex items-start gap-4 p-4 hover:bg-muted/40 transition-colors ${m.unread ? "bg-muted/20" : ""}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {m.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <span className="text-xs text-muted-foreground truncate">&lt;{m.email}&gt;</span>
                  {m.unread && <Badge className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 h-5">New</Badge>}
                  <span className="ml-auto text-xs text-muted-foreground shrink-0">{m.time || m.created_at?.slice(0, 10)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{m.message}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" title="Reply" asChild>
                  <a href={`mailto:${m.email}`}><Reply className="w-4 h-4" /></a>
                </Button>
                <DeleteConfirmDialog
                  title="Delete message?"
                  description={`Are you sure you want to delete this visitor message from ${m.name}?`}
                  onConfirm={() => handleDelete(m.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
        <Mail className="w-3 h-3" /> Messages are also stored securely in Firebase Firestore.
      </p>
    </div>
  );
}

