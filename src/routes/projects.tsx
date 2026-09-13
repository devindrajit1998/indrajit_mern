import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ExternalLink, Github, Zap } from "lucide-react";
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

      {/* Bento Grid */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {projects.map((p, idx) => {
          // Bento layout rhythm: 1st card spans 7 cols, 2nd spans 5 cols, 3rd spans 5 cols, 4th spans 7 cols, others 6/4/4
          const isLarge = idx % 4 === 0 || idx % 4 === 3;
          const colSpan = isLarge ? "lg:col-span-7" : "lg:col-span-5";

          return (
            <article
              key={p.slug}
              onClick={() => setSelected(p)}
              className={`group relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1322]/90 to-[#070a14]/95 p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-brand-purple/50 hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${colSpan}`}
            >
              {/* Subtle top neon border accent */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl group-hover:bg-brand-purple/20 transition-all duration-500 pointer-events-none" />

              <div>
                {/* Header: Browser Dots + Category & Status */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                      {p.category || "Full-Stack App"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.status && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {p.status}
                      </span>
                    )}
                    {p.featured !== false && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/40">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Media Preview Box (Mockup Frame) */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 mb-5 aspect-[16/9] sm:aspect-[16/8]">
                  <img
                    src={p.img || heroDev}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a14] via-transparent to-black/20" />
                  
                  {/* Floating Action Hint */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-lg">
                      View Project <ExternalLink className="w-3.5 h-3.5 text-brand-purple" />
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-black/70 text-white/90 backdrop-blur-md border border-white/10 font-medium">
                      {p.year}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple backdrop-blur-md border border-brand-purple/30 font-medium">
                      {p.role}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-brand-purple transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>

              {/* Bento Footer: Impact Callout + Tech Stack */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                {p.impact && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-purple/15 via-brand-purple/5 to-transparent border border-brand-purple/25 text-brand-purple text-xs font-medium">
                    <Zap className="w-4 h-4 text-brand-purple shrink-0" />
                    <span className="truncate">{p.impact}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(p.tags || []).slice(0, isLarge ? 5 : 4).map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10 hover:border-brand-purple/40 hover:text-white transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                    {(p.tags || []).length > (isLarge ? 5 : 4) && (
                      <span className="text-[10px] px-2 py-1 rounded-md text-muted-foreground font-medium bg-white/5">
                        +{(p.tags || []).length - (isLarge ? 5 : 4)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-xs group-hover:text-brand-purple transition-colors font-medium">
                    <span>Explore</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </SiteLayout>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border border-white/15 bg-[#080c16] backdrop-blur-2xl shadow-2xl rounded-2xl">
        {project && (
          <div className="max-h-[85vh] overflow-y-auto flex flex-col">
            {/* Modal Header Bar with simulated browser dots */}
            <div className="px-6 py-3.5 border-b border-white/10 bg-[#060912] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-xs font-mono text-muted-foreground/70 hidden sm:inline">
                  project://{project.slug}
                </span>
              </div>
              <div className="flex items-center gap-2 pr-8">
                {project.status && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {project.status}
                  </span>
                )}
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Hero Image Showcase with Glass Frame */}
            {project.img && (
              <div className="relative w-full bg-[#04060c] p-4 sm:p-6 pb-0">
                <div className="rounded-xl overflow-hidden border border-white/15 shadow-2xl relative max-h-[360px]">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-transparent to-transparent" />
                </div>
              </div>
            )}

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Badges & Title */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/40 font-medium">
                    {project.role}
                  </span>
                  {project.category && (
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/15 font-medium">
                      {project.category}
                    </span>
                  )}
                  {project.featured !== false && (
                    <span className="text-xs px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/40 font-medium">
                      Featured Project
                    </span>
                  )}
                </div>

                <DialogTitle className="text-2xl sm:text-3xl font-bold font-display text-white">
                  {project.title}
                </DialogTitle>
              </div>

              {/* Key Impact Banner */}
              {project.impact && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-brand-purple/20 via-brand-purple/10 to-transparent border border-brand-purple/30 text-brand-purple text-sm font-medium">
                  <Zap className="w-5 h-5 shrink-0" />
                  <span>Key Result: {project.impact}</span>
                </div>
              )}

              {/* Description */}
              <DialogDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.overview || project.desc}
              </DialogDescription>

              {/* Key Features (if any) */}
              {Array.isArray(project.features) && project.features.filter(Boolean).length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Key Highlights
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2.5">
                    {project.features.filter(Boolean).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90 bg-white/5 border border-white/10 p-2.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-brand-purple mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Chips */}
              {Array.isArray(project.tags) && project.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Technologies & Architecture
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1.5 rounded-lg bg-brand-purple/15 text-white border border-brand-purple/30 font-medium shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-white/10">
                {project.liveUrl && project.liveUrl !== "#" ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-brand-purple/20"
                  >
                    Launch Live Demo <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
                {project.repoUrl && project.repoUrl !== "#" ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 hover:border-brand-purple/40 text-foreground transition"
                  >
                    <Github className="w-4 h-4" /> View Source Code
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
