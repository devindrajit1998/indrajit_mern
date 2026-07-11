import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteLayout } from "@/components/site-layout";
import { submitContactMessage } from "@/lib/contact.functions";
import { useFirestoreDoc } from "@/hooks/useFirestore";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Indrajit Ghosh, MERN Developer" },
      { name: "description", content: "Get in touch for MERN-stack projects, collaborations or freelance opportunities." },
      { property: "og:title", content: "Contact Indrajit Ghosh" },
      { property: "og:description", content: "Send a message about your project or collaboration." },
    ],
  }),
  component: ContactPage,
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

function ContactPage() {
  const submit = useServerFn(submitContactMessage);
  const [pending, setPending] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  // Fetch dynamic contact info from Firestore
  const { data: settings } = useFirestoreDoc("settings", "site_settings", {
    github: "https://github.com/indrajit",
    linkedin: "https://linkedin.com/in/indrajit",
    twitter: "https://x.com/indrajit",
    email: "hello@indrajit.dev",
    enableContactForm: true,
  });

  const { data: bio } = useFirestoreDoc("about", "personal_bio", {
    email: "hello@indrajit.dev",
    location: "Kolkata, India",
    phone: "+91 98765 43210",
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setPending(true);
    try {
      await submit({ data: parsed.data });
      toast.success("Message sent — I'll get back to you soon!");
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteLayout>
      <section className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Contact</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Let's build <span className="gradient-text">something</span> together
          </h1>
          <p className="mt-4 text-muted-foreground">
            Have a project in mind, a role to fill, or just want to say hi? Drop a message and
            I'll reply within a day.
          </p>

          <div className="mt-8 space-y-4">
            <InfoRow icon={Mail} label="Email" value={bio.email || settings.email || "hello@indrajit.dev"} href={`mailto:${bio.email || settings.email}`} />
            {(bio as any).phone && (
              <InfoRow icon={Phone} label="Phone" value={(bio as any).phone} href={`tel:${(bio as any).phone}`} />
            )}
            <InfoRow icon={MapPin} label="Location" value={bio.location || "Kolkata, India"} />
          </div>

          <div className="mt-8 flex gap-3">
            {settings.github && (
              <a href={settings.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {settings.twitter && (
              <a href={settings.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {(settings.email || bio.email) && (
              <a href={`mailto:${settings.email || bio.email}`} className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition" title="Email">
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass-card p-6 md:p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Your name">
              <input
                required maxLength={100}
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                className="w-full h-11 rounded-lg bg-secondary/40 border border-border px-3 text-sm focus:outline-none focus:border-brand-purple transition"
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Email">
              <input
                required type="email" maxLength={255}
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                className="w-full h-11 rounded-lg bg-secondary/40 border border-border px-3 text-sm focus:outline-none focus:border-brand-purple transition"
                placeholder="jane@company.com"
              />
            </Field>
          </div>
          <Field label="Message">
            <textarea
              required maxLength={2000} rows={6}
              value={values.message}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              className="w-full rounded-lg bg-secondary/40 border border-border p-3 text-sm focus:outline-none focus:border-brand-purple transition resize-none"
              placeholder="Tell me about your project…"
            />
          </Field>
          <button
            type="submit" disabled={pending}
            className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {pending ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-lg bg-brand-purple/20 text-brand-purple flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
        {href ? (
          <a href={href} className="text-sm font-medium hover:text-brand-purple transition">{value}</a>
        ) : (
          <div className="text-sm font-medium">{value}</div>
        )}
      </div>
    </div>
  );
}
