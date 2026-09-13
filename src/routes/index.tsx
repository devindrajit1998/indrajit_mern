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
          <h2 className="text-2xl font-bold">Featured <span className="gradient-text">Projects</span></h2>
          <Link to="/projects" className="text-sm text-brand-purple flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {projects.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelected(p)}
              className="glass-card overflow-hidden hover:border-brand-purple/60 hover:-translate-y-1 transition-all text-left"
            >
              <div className="relative">
                <img src={p.img || heroDev} alt={p.title} loading="lazy" width={768} height={512} className="w-full h-40 object-cover" />
                <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-md btn-glow font-semibold">Featured</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(p.tags || []).slice(0, 4).map((t: string) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/15 text-brand-purple border border-brand-purple/30">{t}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
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
                  {project.tags.map((t) => (
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
