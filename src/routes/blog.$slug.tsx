import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Share2, Tag, BookOpen, Check } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { mockBlogs, type BlogPost } from "@/lib/portfolio-data";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { list: blogs, loading } = useFirestoreCollection<BlogPost>("blogs", mockBlogs);
  const [copied, setCopied] = useState(false);

  const post = blogs.find((b) => b.slug === slug);

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-3xl mx-auto py-12 space-y-6">
          <div className="h-4 w-24 bg-muted/40 rounded animate-pulse" />
          <div className="h-10 w-full bg-muted/40 rounded animate-pulse" />
          <div className="h-64 w-full bg-muted/40 rounded-2xl animate-pulse" />
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold font-display">Article Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-glow font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="max-w-3xl mx-auto pb-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand-purple transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Engineering Blog
          </Link>
        </div>

        {/* Article Meta Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/40 font-medium">
              {post.category || "Engineering"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Calendar className="w-3.5 h-3.5 text-brand-purple" />
              {post.publishedAt}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Clock className="w-3.5 h-3.5 text-brand-blue" />
              {post.readTime || "5 min read"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground/90 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {(post.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </header>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="relative rounded-2xl overflow-hidden mb-10 border border-white/15 shadow-2xl bg-black/50">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[420px] object-cover object-center"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed text-sm sm:text-base">
          {post.content ? (
            <div className="whitespace-pre-line leading-relaxed space-y-4">
              {post.content.split("\n\n").map((block, idx) => {
                if (block.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-xl sm:text-2xl font-bold font-display text-white mt-8 mb-2">
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-2xl sm:text-3xl font-bold font-display text-white mt-10 mb-3 border-b border-white/10 pb-2">
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("```")) {
                  const cleanedCode = block.replace(/```[a-z]*\n?/gi, "").trim();
                  return (
                    <div key={idx} className="my-5 rounded-xl overflow-hidden border border-white/15 bg-[#05070d] p-4 text-xs font-mono text-emerald-300 overflow-x-auto shadow-inner">
                      <pre><code>{cleanedCode}</code></pre>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-muted-foreground/90 leading-relaxed">
                    {block}
                  </p>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Article Footer Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-brand-purple/30 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-lg font-display text-white">Enjoyed this article?</h4>
            <p className="text-xs text-muted-foreground">
              Have a question or want to collaborate on a full-stack project?
            </p>
          </div>
          <Link
            to="/contact"
            className="btn-glow btn-glow-hover inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shadow-lg shadow-brand-purple/20"
          >
            Start a Conversation
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
}
