import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";

export const metadata = {
  title: "Blog — Porady o Kupnie i Sprzedaży Sklepów Internetowych",
  description:
    "Eksperckie porady o e-commerce, wycenie sklepów, due diligence i bezpiecznych transakcjach. Czytaj blog SklepMarket.pl.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Poradniki: "bg-violet-lighter text-violet",
  "Case Studies": "bg-emerald-50 text-emerald-700",
  Wiadomości: "bg-blue-50 text-blue-700",
  "Analiza rynku": "bg-amber-50 text-amber-700",
};

export default async function BlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const typedPosts = (posts ?? []) as BlogPost[];
  const [featured, ...rest] = typedPosts;

  return (
    <>
      {/* Hero */}
      <section className="dark-gradient-bg relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet/10 blur-[120px] rounded-full"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-glow/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-glow">
            Blog SklepMarket.pl
          </div>
          <h1 className="headline-lg text-white mb-4 max-w-2xl">
            Porady dla kupujących i sprzedających
          </h1>
          <p className="text-on-dark-faint leading-relaxed max-w-xl">
            Praktyczne przewodniki o e-commerce, wycenie sklepów, due diligence
            i tym, jak bezpiecznie przeprowadzić transakcję.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {typedPosts.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-edge bg-bg-section">
            <p className="text-ink-muted">Brak opublikowanych postów — wróć wkrótce.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-10 flex flex-col lg:flex-row gap-0 rounded-2xl border border-edge bg-white overflow-hidden shadow-card hover:shadow-card-hover hover:border-violet/30 transition-all duration-200"
              >
                <div className="lg:w-2/5 aspect-video lg:aspect-auto bg-gradient-to-br from-violet-lighter to-violet/10 flex items-center justify-center">
                  <span className="text-7xl">📖</span>
                </div>
                <div className="flex flex-col justify-center p-8 lg:w-3/5">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[featured.category] ?? "bg-violet-lighter text-violet"}`}
                    >
                      {featured.category}
                    </span>
                    <span className="text-xs text-ink-faint flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(featured.created_at).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="headline-sm text-ink mb-3 group-hover:text-violet transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-ink-muted leading-relaxed mb-5 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet">
                    Czytaj artykuł <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group card card-hover flex flex-col overflow-hidden"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-violet-lighter to-violet/10 flex items-center justify-center">
                      <span className="text-5xl">📝</span>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-violet-lighter text-violet"}`}
                        >
                          {post.category}
                        </span>
                        <span className="text-[10px] text-ink-faint">
                          {new Date(post.created_at).toLocaleDateString("pl-PL")}
                        </span>
                      </div>
                      <h2 className="font-bold text-ink text-base mb-2 line-clamp-2 group-hover:text-violet transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-ink-muted leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 text-[10px] text-ink-faint bg-bg-section px-2 py-0.5 rounded-full"
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
