import { Link } from "@tanstack/react-router";
import { Download, ArrowUp, Github, Linkedin, Twitter, Mail, Home, User, FolderKanban, Wrench, Send, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { navLinks } from "@/lib/portfolio-data";
import { Background } from "./ui/Background";
import { useFirestoreDoc } from "@/hooks/useFirestore";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data: bio } = useFirestoreDoc<any>("about", "personal_bio");
  const { data: settings } = useFirestoreDoc<any>("settings", "site_settings");
  
  const isFreelancer = settings?.freelancerMode === true;

  // Mobile app dock links mapping to lucide icons
  const dockLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: User },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    ...(isFreelancer ? [{ to: "/services", label: "Services", icon: Wrench }] : []),
    { to: "/contact", label: "Contact", icon: Send },
  ];

  return (
    <div className="min-h-screen text-foreground flex flex-col relative z-0">
      <Background />
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-border/40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/" className="logo-link font-display font-bold text-lg sm:text-xl flex items-center gap-0.5">
            <span className="logo-bracket-left text-brand-blue transition-transform duration-300 ease-out">&lt;</span>
            Dev&nbsp;<span className="gradient-text">Indra</span>
            <span className="logo-bracket-right text-brand-blue transition-transform duration-300 ease-out">/&gt;</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.filter(n => n.to !== "/services" || isFreelancer).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-purple data-[status=active]:text-brand-purple data-[status=active]:border-b-2 data-[status=active]:border-brand-purple data-[status=active]:pb-1"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          {bio?.resumeUrl || bio?.resumeBase64 ? (
            <a
              href={bio.resumeUrl || bio.resumeBase64}
              target={bio.resumeUrl ? "_blank" : undefined}
              rel={bio.resumeUrl ? "noreferrer" : undefined}
              download={bio.resumeUrl ? undefined : "resume.pdf"}
              className="btn-glow btn-glow-hover inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Resume
            </a>
          ) : (
            <button
              disabled
              className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" /> Resume
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 lg:pb-12">
        {children}
      </main>

      {/* Mobile App Bottom Navigation Dock */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-border/40 py-2 pb-safe px-4 flex justify-around items-center rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        {dockLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-brand-purple data-[status=active]:text-brand-purple"
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <footer className="hidden lg:block border-t border-border/50 py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Indrajit Ghosh. All rights reserved.</p>
          <div className="flex gap-3">
            {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg glass-card flex items-center justify-center hover:text-brand-purple transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p>♥ Built with React & Tailwind CSS</p>
        </div>
      </footer>

      {/* Back to top button (Hidden on mobile to make room for app dock) */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="hidden lg:flex fixed bottom-6 right-6 w-10 h-10 rounded-full glass-card items-center justify-center hover:text-brand-purple transition"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}

