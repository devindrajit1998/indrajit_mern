import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Clock, Calendar, ArrowRight, Tag, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useFirestoreCollection, useFirestoreDoc } from "@/hooks/useFirestore";
import { mockBlogs, type BlogPost } from "@/lib/portfolio-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Engineering Blog — Indrajit Ghosh" },
      { name: "description", content: "Technical deep dives, MERN stack architecture, web performance, and developer notes by Indrajit Ghosh." },
      { property: "og:title", content: "Engineering Blog — Indrajit Ghosh" },
      { property: "og:description", content: "Technical deep dives and architectural notes on full-stack web development." },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { list: blogs, loading } = useFirestoreCollection<BlogPost>("blogs", mockBlogs);
  const { data: settings } = useFirestoreDoc<any>("settings", "site_settings");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const publishedBlogs = blogs.filter((b) => b.published !== false);

  const allTags = [
    "All",
    ...Array.from(new Set(publishedBlogs.flatMap((b) => b.tags || []))).filter(Boolean),
  ];

  const filteredBlogs = publishedBlogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = selectedTag === "All" || (b.tags || []).includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const featuredPost = publishedBlogs.find((b) => b.featured) || publishedBlogs[0];
  const regularPosts = filteredBlogs.filter((b) => b.slug !== featuredPost?.slug);

  if (loading) {
    return (
      <SiteLayout>
        <section className="max-w-3xl">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-16 w-full" />
        </section>
        <section className="mt-10 grid gap-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Header */}
      <section className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/15 text-brand-purple border border-brand-purple/30 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" /> Technical Notes & Articles
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-display">
          Engineering <span className="gradient-text">Blog</span>
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
          Practical architectural patterns, deep-dives into modern full-stack web engineering, React 19 performance, and lessons learned shipping production apps.
        </p>
      </section>

      {/* Filter & Search Bar */}
      <section className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles, topics or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-[#090d16]/80 border-white/10 focus:border-brand-purple/50"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-xl">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                selectedTag === tag
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/25"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Featured Article (When on 'All' and no search term) */}
      {selectedTag === "All" && !searchTerm && featuredPost && (
        <section className="mt-8">
          <Link
            to={`/blog/$slug`}
            params={{ slug: featuredPost.slug }}
            className="group relative block rounded-2xl border border-white/15 bg-gradient-to-b from-[#0e1322] to-[#070a14] overflow-hidden shadow-2xl hover:border-brand-purple/50 hover:shadow-[0_15px_50px_rgba(139,92,246,0.25)] transition-all duration-300"
          >
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              {featuredPost.coverImage && (
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-black/40">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a14] via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-purple text-white shadow-md">
                      Featured Post
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/70 text-white/90 backdrop-blur-md border border-white/15">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
              )}

              <div className={`p-6 sm:p-8 ${featuredPost.coverImage ? "lg:col-span-5" : "lg:col-span-12"} space-y-4`}>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                    {featuredPost.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-blue" />
                    {featuredPost.readTime || "5 min read"}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-brand-purple transition-colors leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(featuredPost.tags || []).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-purple group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid of Articles */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold font-display text-foreground">
            {searchTerm || selectedTag !== "All" ? `Results (${filteredBlogs.length})` : "Latest Articles"}
          </h3>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-2xl border border-white/10">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <h4 className="text-base font-semibold">No articles found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search query or selecting a different tag filter.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedTag === "All" && !searchTerm ? regularPosts : filteredBlogs).map((post) => (
              <Link
                key={post.slug}
                to={`/blog/$slug`}
                params={{ slug: post.slug }}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1322]/90 to-[#070a14]/95 p-5 backdrop-blur-xl shadow-xl hover:border-brand-purple/50 hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  {post.coverImage && (
                    <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 bg-black/40 border border-white/10">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/75 text-white/90 backdrop-blur-md border border-white/15">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono mb-2">
                    <span>{post.publishedAt}</span>
                    <span>•</span>
                    <span>{post.readTime || "4 min read"}</span>
                  </div>

                  <h4 className="font-bold text-base sm:text-lg text-foreground group-hover:text-brand-purple transition-colors mb-2 leading-snug">
                    {post.title}
                  </h4>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(post.tags || []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-brand-purple inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
