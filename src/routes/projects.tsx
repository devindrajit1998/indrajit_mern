import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ExternalLink, Github } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SiteLayout } from "@/components/site-layout";
import { type Project } from "@/lib/portfolio-data";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import heroDev from "@/assets/hero-dev.png";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Featured MERN Stack Work" },
      { name: "description", content: "Featured projects by Indrajit Ghosh: full-stack MERN apps, dashboards and collaborative tools." },
      { property: "og:title", content: "Projects — Indrajit Ghosh" },
      { property: "og:description", content: "A selection of featured MERN stack projects." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null);
  const { list: projects, loading } = useFirestoreCollection<any>("projects");

  if (loading) {
    return (
      <SiteLayout>
        <section className="max-w-3xl">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-16 w-full" />
        </section>
        <section className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </section>
      </SiteLayout>
    );
  }


  return (
    <SiteLayout>
      <section className="max-w-3xl">
        <p className="text-sm text-muted-foreground mb-2">Portfolio</p>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Featured <span className="gradient-text">Projects</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          A selection of full-stack applications I've designed and shipped — click any card for
          a deeper look at features and tech stack.
        </p>
      </section>

      <section className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <article
            key={p.slug}
            onClick={() => setSelected(p)}
            className="glass-card overflow-hidden hover:border-brand-purple/60 hover:-translate-y-1 transition-all cursor-pointer text-left"
          >
            <div className="relative">
              <img src={p.img || heroDev} alt={p.title} loading="lazy" width={768} height={512} className="w-full h-44 object-cover" />
              <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-md btn-glow font-semibold">Featured</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{p.title}</h3>
                <span className="text-[10px] text-muted-foreground">{p.year}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {(p.tags || []).map((t: string) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/15 text-brand-purple border border-brand-purple/30">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </SiteLayout>
  );
}


function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-border/60 bg-background/95 backdrop-blur-xl">
        {project && (
          <div className="max-h-[85vh] overflow-y-auto">
            <div className="relative">
              <img src={project.img} alt={project.title} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <DialogTitle className="text-3xl font-bold font-display">{project.title}</DialogTitle>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{project.year}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{project.role}</span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {project.overview}
              </DialogDescription>
              <div>
                <h4 className="text-sm font-semibold mb-3 gradient-text inline-block">Key Features</h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-brand-purple mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(project.tags || []).map((t: string) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded bg-brand-purple/15 text-brand-purple border border-brand-purple/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                  className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
                  Live Demo <ExternalLink className="w-4 h-4" />
                </a>
                <a href={project.repoUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-border bg-card/50 hover:bg-card transition">
                  <Github className="w-4 h-4" /> Source Code
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
