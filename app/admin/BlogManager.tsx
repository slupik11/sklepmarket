"use client";

import { useState, useTransition } from "react";
import { Plus, Eye, EyeOff, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { saveBlogPost, toggleBlogPublished, deleteBlogPost } from "@/app/actions/admin";
import type { BlogPost } from "@/lib/supabase/types";

interface Props {
  posts: BlogPost[];
}

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  featured_image: string;
  tags: string;
  published: boolean;
};

const empty: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Poradniki",
  author_name: "SklepMarket Team",
  featured_image: "",
  tags: "",
  published: false,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogManager({ posts }: Props) {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormData>(empty);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showForm = creating || editing !== null;

  function openCreate() {
    setForm(empty);
    setEditing(null);
    setError(null);
    setCreating(true);
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author_name: post.author_name,
      featured_image: post.featured_image ?? "",
      tags: post.tags?.join(", ") ?? "",
      published: post.published,
    });
    setEditing(post);
    setCreating(false);
    setError(null);
  }

  function cancelForm() {
    setCreating(false);
    setEditing(null);
    setForm(empty);
    setError(null);
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !editing) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      author_name: form.author_name.trim() || "SklepMarket Team",
      featured_image: form.featured_image.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: form.published,
    };

    startTransition(async () => {
      try {
        await saveBlogPost(editing?.id ?? null, payload);
        cancelForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd zapisu. Sprawdź czy tabela blog_posts istnieje w Supabase.");
      }
    });
  }

  function handleToggle(post: BlogPost) {
    startTransition(() => toggleBlogPublished(post.id, !post.published));
  }

  function handleDelete(post: BlogPost) {
    if (!confirm(`Usunąć post "${post.title}"?`)) return;
    startTransition(() => deleteBlogPost(post.id));
  }

  /* ── FORM ──────────────────────────────────── */
  if (showForm) {
    return (
      <div className="rounded-xl border border-edge bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-edge px-6 py-4">
          <h3 className="font-bold text-ink">{editing ? "Edytuj post" : "Nowy post"}</h3>
          <button onClick={cancelForm} className="text-sm text-ink-muted hover:text-ink transition-colors">
            ← Anuluj
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 space-y-2">
              <p className="font-semibold">⚠ {error}</p>
              {(error.includes("blog_posts") || error.includes("schema cache") || error.includes("relation")) && (
                <div className="mt-2 p-3 bg-white rounded border border-red-100 text-xs font-mono text-red-900 whitespace-pre-wrap leading-relaxed">
                  {`-- Uruchom w Supabase SQL Editor:\n-- https://supabase.com/dashboard/project/xxmcomvkuaumobxxkljl/sql/new\n\ncreate table if not exists blog_posts (\n  id uuid primary key default gen_random_uuid(),\n  slug text unique not null,\n  title text not null,\n  excerpt text not null,\n  content text not null,\n  featured_image text,\n  author_name text not null default 'SklepMarket Team',\n  category text not null default 'Poradniki',\n  tags text[] default '{}',\n  published boolean default false,\n  views integer default 0,\n  created_at timestamptz default now(),\n  updated_at timestamptz default now()\n);\nalter table blog_posts enable row level security;\ncreate policy "Public read published posts" on blog_posts for select using (published = true);`}
                </div>
              )}
            </div>
          )}

          {/* Tytuł */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Tytuł <span className="text-violet">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="np. Jak wycenić sklep internetowy?"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Slug (URL){" "}
              <span className="text-ink-faint font-normal text-xs">
                — auto z tytułu, edytuj ręcznie jeśli chcesz inny
              </span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="jak-wycenic-sklep-internetowy"
            />
            {form.slug && (
              <p className="mt-1 text-xs text-ink-faint">
                URL: /blog/<strong>{form.slug}</strong>
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Krótki opis (excerpt) <span className="text-violet">*</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              required
              rows={3}
              placeholder="150–200 znaków. Wyświetla się na liście postów i w Google."
              className="resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Treść (HTML) <span className="text-violet">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              required
              rows={18}
              placeholder={"<h2>Nagłówek sekcji</h2>\n<p>Treść akapitu...</p>\n<ul>\n  <li>Punkt listy</li>\n</ul>"}
              className="font-mono text-xs resize-y"
            />
            <p className="mt-1.5 text-xs text-ink-faint">
              Obsługiwane tagi:{" "}
              {["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "blockquote"].map((tag) => (
                <code key={tag} className="mx-0.5 rounded bg-bg-section px-1">
                  &lt;{tag}&gt;
                </code>
              ))}
            </p>
          </div>

          {/* Kategoria + Autor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Kategoria</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option>Poradniki</option>
                <option>Case Studies</option>
                <option>Wiadomości</option>
                <option>Analiza rynku</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Autor</label>
              <input
                type="text"
                value={form.author_name}
                onChange={(e) => set("author_name", e.target.value)}
              />
            </div>
          </div>

          {/* Featured image + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                URL zdjęcia <span className="text-ink-faint font-normal">(opcjonalnie)</span>
              </label>
              <input
                type="url"
                value={form.featured_image}
                onChange={(e) => set("featured_image", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Tagi{" "}
                <span className="text-ink-faint font-normal">(przecinkami)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="e-commerce, wycena, sprzedaż"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Status publikacji</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => set("published", false)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  !form.published
                    ? "border-violet bg-violet-lighter text-violet"
                    : "border-edge text-ink-muted hover:bg-bg-section"
                }`}
              >
                Szkic
              </button>
              <button
                type="button"
                onClick={() => set("published", true)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  form.published
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-edge text-ink-muted hover:bg-bg-section"
                }`}
              >
                Opublikowany
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn-violet !py-2.5 disabled:opacity-60 flex items-center gap-2"
            >
              {isPending && <Loader2 size={15} className="animate-spin" />}
              {isPending ? "Zapisywanie..." : editing ? "Zapisz zmiany" : "Utwórz post"}
            </button>
            <button type="button" onClick={cancelForm} className="btn-outline-violet !py-2.5">
              Anuluj
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ── LIST ──────────────────────────────────── */
  return (
    <div className="rounded-xl border border-edge bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-edge px-6 py-4">
        <h3 className="font-bold text-ink">
          Posty na blogu
          <span className="ml-2 rounded-full bg-bg-section px-2 py-0.5 text-xs font-medium text-ink-faint">
            {posts.length}
          </span>
        </h3>
        <button onClick={openCreate} className="btn-violet text-sm !py-2 !px-4">
          <Plus size={15} />
          Nowy post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-2 text-3xl">📝</p>
          <p className="text-ink-muted">Brak postów. Kliknij &ldquo;Nowy post&rdquo;.</p>
        </div>
      ) : (
        <div className="divide-y divide-edge">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-3 px-5 py-4 hover:bg-bg-section transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-lighter text-violet">
                    {post.category}
                  </span>
                  {post.published ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Opublikowany
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bg-section text-ink-faint border border-edge">
                      Szkic
                    </span>
                  )}
                  <span className="text-xs text-ink-faint">
                    {new Date(post.created_at).toLocaleDateString("pl-PL")}
                  </span>
                  <span className="text-xs text-ink-faint">{post.views} wyśw.</span>
                </div>
                <p className="font-semibold text-ink truncate">{post.title}</p>
                <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{post.excerpt}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    title="Podgląd"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-violet-lighter hover:text-violet transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => handleToggle(post)}
                  disabled={isPending}
                  title={post.published ? "Ukryj (cofnij publikację)" : "Opublikuj"}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-violet-lighter hover:text-violet transition-colors disabled:opacity-40"
                >
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  title="Edytuj"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-violet-lighter hover:text-violet transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  disabled={isPending}
                  title="Usuń"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
