import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { services as mockServices } from "@/lib/portfolio-data";
import { Code2, Server, Palette, Zap, Database, Cloud } from "lucide-react";

const iconMap: Record<string, any> = {
  Code2, Server, Palette, Zap, Database, Cloud
};

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

function ServicesPage() {
  const { list: services, loading } = useFirestoreCollection<any>("services", mockServices);

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto py-10">
        <p className="text-sm text-brand-purple uppercase tracking-wider mb-2 font-semibold">Services</p>
        <h1 className="text-4xl lg:text-5xl font-bold font-display mb-6">
          What I <span className="gradient-text">Offer</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-2xl">
          High-performance full-stack MERN development services tailored to build products, scale infrastructure, and optimize experiences.
        </p>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-36 glass-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => {
              const Icon = iconMap[s.icon as any] || Code2;
              return (
                <div key={s.title} className="glass-card p-6 hover:border-brand-purple/40 transition duration-300">
                  <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
