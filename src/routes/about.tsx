import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Mail, GraduationCap, FileCheck, Trophy, Medal, Award } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useFirestoreDoc, useFirestoreCollection } from "@/hooks/useFirestore";
import heroDev from "@/assets/hero-dev.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Indrajit Ghosh, MERN Stack Developer" },
      { name: "description", content: "Full-stack MERN developer with 3+ years building scalable web apps. Skills, experience and background." },
      { property: "og:title", content: "About Indrajit Ghosh" },
      { property: "og:description", content: "MERN stack developer — experience, skills and background." },
    ],
  }),
  component: AboutPage,
});

import { Skeleton } from "@/components/ui/skeleton";

const awardIconMap: Record<string, any> = {
  Trophy, Medal, Award
};

function AboutPage() {
  const { data: bio, loading: bioLoading } = useFirestoreDoc<any>("about", "personal_bio");
  const { data: credentialsDoc, loading: credentialsLoading } = useFirestoreDoc<any>("credentials", "portfolio_credentials");
  const { list: experience, loading: experienceLoading } = useFirestoreCollection<any>("experience");
  const { list: skills, loading: skillsLoading } = useFirestoreCollection<any>("skills");
  const { data: skillsDoc, loading: skillsLoadingDoc } = useFirestoreDoc<any>("skills", "portfolio_skills");

  const isLoading = bioLoading || credentialsLoading || experienceLoading || skillsLoading || skillsLoadingDoc;

  if (isLoading) {
    return (
      <SiteLayout>
        <section className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-28" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }



  return (
    <SiteLayout>
      <section className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-3xl bg-brand-purple/25" />
          <img src={bio.avatarBase64 || bio.avatarUrl || heroDev} alt="Indrajit Ghosh" width={320} height={320}
            className="relative rounded-2xl w-full aspect-square object-cover" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">About Me</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Building the web with the <span className="gradient-text">MERN</span> stack.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {bio.longBio || bio.shortBio}
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {(bio.stats || []).map((s: any) => (
              <div key={s.label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold">
              Hire Me <Mail className="w-4 h-4" />
            </Link>
            {bio.resumeBase64 ? (
              <a
                href={bio.resumeBase64}
                download="resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-border bg-card/50 hover:bg-card transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download CV
              </a>
            ) : (
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-border bg-card/50 hover:bg-card transition opacity-60 pointer-events-none">
                <Download className="w-4 h-4" /> Download CV
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mt-16 grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-5">Skills</h2>
          <div className="space-y-4">
            {skills
              .filter((s: any) => s.name && s.id !== "portfolio_skills")
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
              .map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: "var(--gradient-brand)" }} />
                </div>
              </div>
            ))}
          </div>
          <h3 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground">Tools & Libraries</h3>
          <div className="flex flex-wrap gap-1.5">
            {(skillsDoc.techStack || []).map((t: string) => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded bg-brand-purple/15 text-brand-purple border border-brand-purple/30">{t}</span>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Experience</h2>
            <Link to="/contact" className="text-xs text-brand-purple flex items-center gap-1">Get in touch <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-6 relative before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
            {experience.map((e) => (
              <div key={e.company} className="pl-6 relative">
                <span className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-current bg-background ${e.color || "text-brand-blue"}`} />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className={`font-semibold ${e.color || "text-brand-blue"}`}>{e.title}</h4>
                    <p className="text-xs text-muted-foreground">{e.company}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{e.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Qualifications</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {(credentialsDoc.qualifications || []).map((q: any) => (
            <div key={q.degree} className="glass-card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/15 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">{q.degree}</h3>
                <p className="text-sm text-muted-foreground mt-1">{q.institution}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{q.year}</span>
                  <span className="px-2 py-0.5 rounded bg-brand-blue/15 text-brand-blue">{q.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Certifications</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {(credentialsDoc.certifications || []).map((c: any) => (
            <div key={c.title} className="glass-card p-5">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/15 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5 text-brand-purple" />
              </div>
              <h3 className="font-semibold leading-tight">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.provider}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>{c.year}</span>
                <span className="text-[10px] truncate max-w-[140px]">{c.credential}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Awards & Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {(credentialsDoc.awards || []).map((a: any) => {
            const Icon = a.icon ? awardIconMap[a.icon as string] || Trophy : Trophy;
            return (
              <div key={a.title} className="glass-card p-5">
                <div className="w-10 h-10 rounded-lg bg-brand-green/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-semibold leading-tight">{a.title}</h3>
                <p className="text-sm text-brand-green mt-1">{a.event}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

