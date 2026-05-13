import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/supabase/types";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Post nie znaleziony" };
  return {
    title: data.title,
    description: data.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const p = post as BlogPost;

  // Increment view count (fire and forget)
  supabase
    .from("blog_posts")
    .update({ views: (p.views || 0) + 1, updated_at: p.updated_at })
    .eq("id", p.id)
    .then(() => {});

  // Related posts (same category, different slug)
  const { data: related } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, created_at")
    .eq("published", true)
    .eq("category", p.category)
    .neq("slug", p.slug)
    .limit(3);

  return (
    <>
      {/* Hero strip */}
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
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-on-dark-muted">
            <Link href="/blog" className="flex items-center gap-1.5 hover:text-on-dark transition-colors">
              <ArrowLeft size={14} />
              Blog
            </Link>
            <span>/</span>
            <span className="text-on-dark-faint truncate max-w-[200px]">{p.title}</span>
          </div>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-violet/20 text-violet-glow">
              {p.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-on-dark-muted">
              <Clock size={12} />
              {new Date(p.created_at).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {p.views > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-on-dark-muted">
                <Eye size={12} />
                {p.views} wyświetleń
              </span>
            )}
          </div>

          <h1 className="headline-md text-white mb-4">{p.title}</h1>
          <p className="text-lg text-on-dark-faint leading-relaxed max-w-2xl">{p.excerpt}</p>

          {/* Author */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/30 text-sm font-bold text-white">
              {p.author_name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-on-dark">{p.author_name}</p>
              <p className="text-xs text-on-dark-muted">SklepMarket.pl</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-[1fr_260px] gap-12 items-start">
          {/* Main article */}
          <article>
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-ink
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-3
                prose-p:text-ink-muted prose-p:leading-relaxed
                prose-a:text-violet prose-a:no-underline hover:prose-a:underline
                prose-strong:text-ink prose-strong:font-bold
                prose-ul:space-y-2 prose-li:text-ink-muted
                prose-li:marker:text-violet"
              dangerouslySetInnerHTML={{ __html: p.content }}
            />

            {/* Tags */}
            {p.tags && p.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-edge flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs text-ink-faint bg-bg-section px-3 py-1.5 rounded-full"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 rounded-2xl dark-gradient-bg p-8 relative overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-widest text-on-dark-muted mb-2">
                  Gotowy działać?
                </p>
                <h3 className="text-xl font-black text-white mb-2">
                  Przeglądaj dostępne sklepy
                </h3>
                <p className="text-on-dark-faint text-sm mb-5 leading-relaxed">
                  Wszystkie oferty mają zweryfikowane dane finansowe i pełne wsparcie przy transakcji.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/oferty" className="btn-white-on-dark text-sm">
                    Zobacz oferty
                  </Link>
                  <Link href="/sprzedaj" className="btn-ghost-on-dark text-sm">
                    Sprzedaj sklep
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-violet mb-3">
                Autor
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-lighter text-sm font-black text-violet">
                  {p.author_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{p.author_name}</p>
                  <p className="text-xs text-ink-faint">Ekspert e-commerce</p>
                </div>
              </div>
            </div>

            {related && related.length > 0 && (
              <div className="card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-violet mb-4">
                  Podobne artykuły
                </p>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/blog/${r.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-semibold text-ink group-hover:text-violet transition-colors line-clamp-2 mb-1">
                        {r.title}
                      </p>
                      <p className="text-xs text-ink-faint">
                        {new Date(r.created_at).toLocaleDateString("pl-PL")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-violet/20 bg-violet-lighter p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-violet mb-2">
                Sprzedajesz sklep?
              </p>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Dyskretna wycena, NDA przy pierwszym kontakcie.
              </p>
              <Link href="/sprzedaj" className="btn-violet text-sm w-full justify-center">
                Skontaktuj się
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
