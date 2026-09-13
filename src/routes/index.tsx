import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Github, Linkedin, Twitter, Mail, Send, ArrowRight, Quote, Star,
  CheckCircle2, ExternalLink, Download, Code2, Server, Palette, Zap, Database, Cloud,
  ChevronLeft, ChevronRight
} from "lucide-react";

import { SiteLayout } from "@/components/site-layout";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { mernStack, type Project, stats as defaultStats, testimonials as defaultTestimonials, type Testimonial } from "@/lib/portfolio-data";
import { useFirestoreDoc, useFirestoreCollection } from "@/hooks/useFirestore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import heroDev from "@/assets/hero-dev.png";
import testimonialAvatar from "@/assets/testimonial-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indrajit Ghosh — MERN Stack Developer open to full-time roles" },
      { name: "description", content: "Portfolio of Indrajit Ghosh, a MERN stack developer with 3+ years of experience, actively seeking full-time software engineering opportunities." },
      { property: "og:title", content: "Indrajit Ghosh — MERN Stack Developer open to full-time roles" },
      { property: "og:description", content: "Portfolio of Indrajit Ghosh, a MERN stack developer with 3+ years of experience, actively seeking full-time software engineering opportunities." },
    ],
  }),
  component: Portfolio,
});

const mernIcons: Record<string, React.ReactNode> = {
  "MongoDB": (
    <img
      src="https://ik.imagekit.io/ke0svl4rq/MongoDB_rLV71jszN.png"
      alt="MongoDB"
      className="w-9 h-9 object-contain"
    />
  ),
  "Express.js": (
    <img
      src="https://ik.imagekit.io/ke0svl4rq/Express_Oaol0EqO_.png"
      alt="Express.js"
      className="w-9 h-9 object-contain invert"
    />
  ),
  "React.js": (
    <img
      src="https://ik.imagekit.io/ke0svl4rq/React_ovP4G3XWC.png"
      alt="React.js"
      className="w-9 h-9 object-contain"
    />
  ),
  "Node.js": (
    <img
      src="https://ik.imagekit.io/ke0svl4rq/Node.js_wv9J6c8Ze.png"
      alt="Node.js"
      className="w-9 h-9 object-contain"
    />
  ),
};


import { Skeleton } from "@/components/ui/skeleton";

// Helper to map icon string name to Lucide components
const iconMap: Record<string, any> = {
  Code2, Server, Palette, Zap, Database, Cloud
};

function Portfolio() {
  const [selected, setSelected] = useState<Project | null>(null);

  // Fetch Firestore values dynamically
  const { data: bio, loading: bioLoading } = useFirestoreDoc<any>("about", "personal_bio");
  const { data: settings, loading: settingsLoading } = useFirestoreDoc<any>("settings", "site_settings");
  const { list: projects, loading: projectsLoading } = useFirestoreCollection<any>("projects");
  const { list: services, loading: servicesLoading } = useFirestoreCollection<any>("services");
  const { data: skillsDoc, loading: skillsLoading } = useFirestoreDoc<any>("skills", "portfolio_skills");
  const { list: testimonialsList } = useFirestoreCollection<Testimonial>("testimonials", defaultTestimonials);

  const isLoading = bioLoading || settingsLoading || projectsLoading || servicesLoading || skillsLoading;

  if (isLoading) {
    return (
      <SiteLayout>
        <section className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">
          <div>
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-24 w-80 mb-6" />
            <Skeleton className="h-16 w-full max-w-md mb-8" />
            <div className="flex gap-3 mb-8">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-32" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
          <div className="flex justify-center">
            <Skeleton className="w-[340px] lg:w-[420px] aspect-square rounded-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-5" />
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        </section>
      </SiteLayout>
    );
  }



  return (
    <SiteLayout>
      {/* Hero */}
      <section className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">
        <div>
          <p className="text-lg text-muted-foreground mb-3">Hi, I'm</p>
          <h1 className="text-6xl lg:text-7xl font-bold leading-[1.05]">
            A <span className="gradient-text">MERN</span> Stack<br />Developer
          </h1>
          <p className="mt-6 text-base text-muted-foreground max-w-md">
            {bio.shortBio}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-purple/20"
            >
              Hire Me / Start Project <Send className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border border-border bg-card/60 hover:bg-card hover:border-brand-purple/40 transition"
            >
              Explore Services <ArrowRight className="w-4 h-4" />
            </Link>
            {settings?.showResume && (bio.resumeUrl || bio.resumeBase64) ? (
              <a
                href={bio.resumeUrl || bio.resumeBase64}
                download={bio.resumeUrl ? undefined : "resume.pdf"}
                target={bio.resumeUrl ? "_blank" : undefined}
                rel={bio.resumeUrl ? "noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Download CV / Resume"
              >
                <Download className="w-3.5 h-3.5" /> Resume
              </a>
            ) : null}
          </div>
          <div className="mt-8 flex gap-4">
            <a href={settings.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition">
              <Github className="w-5 h-5" />
            </a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={settings.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={`mailto:${bio.email}`} className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="relative flex justify-center items-center py-8 lg:py-12">
          <style>{`
            @keyframes float-slow {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .animate-float-1 { animation: float-slow 4s ease-in-out infinite; }
            .animate-float-2 { animation: float-slow 5s ease-in-out infinite 1s; }
            .animate-float-3 { animation: float-slow 4.5s ease-in-out infinite 0.5s; }
            .animate-float-4 { animation: float-slow 3.5s ease-in-out infinite 1.5s; }
          `}</style>

          {/* Main Glass Card */}
          <div
            className="relative w-[340px] lg:w-[400px] h-[440px] lg:h-[500px] rounded-[24px] flex flex-col justify-end items-center overflow-hidden"
            style={{
              backgroundColor: "#050714",
              boxShadow: "0 20px 60px rgba(0,0,0,.5), inset 0 0 40px rgba(139,92,246,0.1)",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}
          >
            {/* Dotted circular orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-dashed border-white/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-dashed border-white/5 pointer-events-none" />

            {/* Glowing blobs behind subject */}
            <div className="absolute top-[20%] left-[10%] w-40 h-40 bg-purple-600 rounded-full blur-[70px] opacity-40 mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[30%] right-[10%] w-40 h-40 bg-blue-500 rounded-full blur-[70px] opacity-40 mix-blend-screen pointer-events-none" />

            {/* Floating tech stack cards (inside) */}
            <div className="absolute top-[12%] left-[8%] w-[56px] h-[56px] rounded-[16px] glass-card border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center animate-float-1 z-30 hover:border-brand-purple/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300 cursor-pointer" style={{ backgroundColor: "rgba(17,24,39,0.8)" }}>
              <div className="transition-transform duration-300 hover:scale-115">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-7 h-7 drop-shadow-[0_0_10px_rgba(97,218,251,0.5)]" />
              </div>
            </div>
            <div className="absolute top-[18%] right-[8%] w-[56px] h-[56px] rounded-[16px] glass-card border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center animate-float-2 z-30 hover:border-brand-purple/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300 cursor-pointer" style={{ backgroundColor: "rgba(17,24,39,0.8)" }}>
              <div className="transition-transform duration-300 hover:scale-115">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-7 h-7 drop-shadow-[0_0_10px_rgba(104,160,99,0.5)]" />
              </div>
            </div>
            <div className="absolute bottom-[40%] left-[6%] w-[56px] h-[56px] rounded-[16px] glass-card border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center animate-float-3 z-30 hover:border-brand-purple/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300 cursor-pointer" style={{ backgroundColor: "rgba(17,24,39,0.8)" }}>
              <div className="transition-transform duration-300 hover:scale-115">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-7 h-7 drop-shadow-[0_0_10px_rgba(71,162,72,0.5)]" />
              </div>
            </div>
            <div className="absolute bottom-[35%] right-[5%] w-[56px] h-[56px] rounded-[16px] glass-card border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center animate-float-4 z-30 hover:border-brand-purple/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300 cursor-pointer" style={{ backgroundColor: "rgba(17,24,39,0.8)" }}>
              <div className="transition-transform duration-300 hover:scale-115">
                <img src="https://ik.imagekit.io/ke0svl4rq/Express_Oaol0EqO_.png" alt="Express" className="w-7 h-7 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
              </div>
            </div>

            {/* Portrait Image */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center z-20 pointer-events-none">
              <img
                src={bio.avatarBase64 || bio.avatarUrl || heroDev}
                alt="Developer portrait"
                className="w-full h-auto object-contain object-bottom"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)"
                }}
              />
            </div>
          </div>

          {/* Status Badge */}
          {settings.showOpenToWork !== false && (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass-card backdrop-blur-md px-5 py-2.5 flex items-center gap-2.5 text-sm whitespace-nowrap rounded-[16px] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)] z-30" style={{ backgroundColor: "#0A0D1A" }}>
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green shadow-[0_0_8px_#10B981] animate-pulse" />
              <span className="font-medium text-white/90">
                {settings.availabilityText || (settings?.freelancerMode !== false ? "Available for Freelance & Contract Projects" : "Actively interviewing for roles")}
              </span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold border-b-2 border-brand-purple pb-2 inline-block mb-5">MERN Stack</h3>
          <div className="grid grid-cols-4 gap-3">
            {mernStack.map((s: any) => (
              <div key={s.name} className="glass-card p-4 text-center hover:border-brand-purple/60 transition flex flex-col items-center justify-center min-h-[110px]">
                <div className="h-10 flex items-center justify-center mb-2">
                  {mernIcons[s.name]}
                </div>
                <div className="text-xs text-muted-foreground">{s.name}</div>
              </div>
            ))}
          </div>
          <div className="glass-card p-5 mt-5 grid grid-cols-4 gap-4">
            {(settings?.freelancerMode ? [
              { value: "3+", label: "Years Experience" },
              { value: "15+", label: "Projects Completed" },
              { value: "10+", label: "Happy Clients" },
              { value: "100%", label: "Client Satisfaction" },
            ] : (bio.stats && bio.stats.length > 0 ? bio.stats : defaultStats)).map((s: any) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack strip */}
      <section className="mt-12">
        <div className="text-center mb-4">
          <span className="text-sm text-muted-foreground">
            <span className="text-brand-blue">&lt;</span> My Tech Stack <span className="text-brand-blue">/&gt;</span>
          </span>
        </div>
        <div className="glass-card p-6 grid grid-cols-6 md:grid-cols-11 gap-4">
          {(skillsDoc.techStack || []).map((t: string) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-secondary/60 border border-border flex items-center justify-center text-xs font-bold">
                {t.slice(0, 2)}
              </div>
              <span className="text-[11px] text-muted-foreground text-center">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects preview */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-purple">Portfolio</span>
            <h2 className="text-2xl font-bold mt-1">Featured <span className="gradient-text">Projects</span></h2>
          </div>
          <Link to="/projects" className="text-sm text-brand-purple flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {projects
            .filter((p) => p.featured !== false)
            .slice(0, 3)
            .map((p, idx) => {
              const colSpan = idx === 0 ? "lg:col-span-12" : "lg:col-span-6";
              const isHero = idx === 0;

              return (
                <div
                  key={p.slug}
                  onClick={() => setSelected(p)}
                  className={`group relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1322]/90 to-[#070a14]/95 p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-brand-purple/50 hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden text-left ${colSpan}`}
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl group-hover:bg-brand-purple/20 transition-all duration-500 pointer-events-none" />

                  <div>
                    {/* Header: Dots + Category */}
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
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/40">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Media Preview Box */}
                    <div className={`relative rounded-xl overflow-hidden border border-white/10 bg-black/40 mb-5 ${isHero ? "aspect-[16/8] sm:aspect-[21/9]" : "aspect-[16/9]"}`}>
                      <img
                        src={p.img || heroDev}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070a14] via-transparent to-black/20" />
                      
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

                    {/* Title & Desc */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-brand-purple transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bento Footer */}
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                    {p.impact && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-purple/15 via-brand-purple/5 to-transparent border border-brand-purple/25 text-brand-purple text-xs font-medium">
                        <Zap className="w-4 h-4 text-brand-purple shrink-0" />
                        <span className="truncate">{p.impact}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(p.tags || []).slice(0, isHero ? 6 : 4).map((t: string) => (
                          <span
                            key={t}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10 hover:border-brand-purple/40 hover:text-white transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground text-xs group-hover:text-brand-purple transition-colors font-medium">
                        <span>Explore</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Services preview */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold">
            {settings?.freelancerMode ? (
              <>My <span className="gradient-text">Services</span></>
            ) : (
              <>What I <span className="gradient-text">bring to a team</span></>
            )}
          </h2>
          {settings?.freelancerMode && (
            <Link to="/services" className="text-sm text-brand-purple flex items-center gap-1">
              See all services <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map((s) => {
            const Icon = s.icon ? iconMap[s.icon as unknown as string] || Code2 : Code2;
            return (
              <div key={s.title} className="glass-card p-5">
                <div className="w-10 h-10 rounded-md bg-brand-purple/20 text-brand-purple flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


      {/* Recommendations & Testimonials Slider */}
      {settings?.freelancerMode && testimonialsList.length > 0 && (
        <TestimonialsSlider testimonials={testimonialsList.filter((t) => t.featured !== false)} />
      )}

      {/* Freelance Project Inquiry CTA */}
      <section className="mt-14 glass-card p-8 sm:p-10 rounded-2xl border border-brand-purple/30 bg-gradient-to-r from-card/80 via-card/50 to-brand-purple/10 flex flex-col lg:flex-row items-center gap-6 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-purple">Ready to collaborate?</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mt-1">Have a project in mind? 🚀</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Let's turn your idea into a fast, modern, and production-ready web application. From MVPs and full-stack platforms to UI redesigns and API integrations.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
          <Link
            to="/contact"
            className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-xl shadow-brand-purple/25"
          >
            Start a Project <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border border-border bg-card/60 hover:bg-card transition"
          >
            View Services
          </Link>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </SiteLayout>
  );
}

function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="mt-14 space-y-6">
      {/* Header with Title and Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Endorsements</p>
          <h2 className="text-2xl lg:text-3xl font-bold font-display">What Clients & Peers Say</h2>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center border border-border/80 hover:border-brand-purple/60 hover:text-brand-purple transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!api?.canScrollNext()}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center border border-border/80 hover:border-brand-purple/60 hover:text-brand-purple transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-5">
            {testimonials.map((t, idx) => (
              <CarouselItem
                key={t.id || idx}
                className="pl-4 sm:pl-5 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full glass-card p-6 flex flex-col justify-between rounded-2xl border border-border/70 hover:border-brand-purple/50 transition-all duration-300 hover:-translate-y-1 relative shadow-sm min-h-[260px]">
                  <div className="space-y-4">
                    {/* Top row: Quote icon + Stars */}
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-brand-purple/15 text-brand-purple flex items-center justify-center">
                        <Quote className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (t.rating || 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/25"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-5">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Customer Info footer */}
                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-3">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover border-2 border-brand-purple/30 shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-brand-purple/20 text-brand-purple font-semibold flex items-center justify-center text-sm border-2 border-brand-purple/30 shrink-0">
                        {t.name ? t.name.substring(0, 2).toUpperCase() : "CU"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate text-foreground">{t.name}</div>
                      {t.date && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">{t.date}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Pagination Dots */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(count)].map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  current === i
                    ? "w-8 h-2 bg-gradient-to-r from-brand-purple to-brand-blue"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
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
