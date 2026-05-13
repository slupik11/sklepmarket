"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Eye, EyeOff, Pencil, Trash2, ExternalLink } from "lucide-react";
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

const emptyForm: FormData = {
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
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const showForm = creating || editing !== null;

  function openCreate() {
    setForm(emptyForm);
    setEditing(null);
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
  }

  function cancelForm() {
    setCreating(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // auto-generate slug when typing title (only if slug not manually edited)
      if (field === "title" && !editing && prev.slug === slugify(prev.title)) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      author_name: form.author_name.trim(),
      featured_image: form.featured_image.trim() || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("blog_posts").insert([payload]);
    }

    setSaving(false);
    cancelForm();
    router.refresh();
  }

  async function togglePublish(post: BlogPost) {
    await supabase
      .from("blog_posts")
      .update({ published: !post.published, updated_at: new Date().toISOString() })
      .eq("id", post.id);
    router.refresh();
  }

  async function deletePost(post: BlogPost) {
    if (!confirm(`Usunąć post "${post.title}"?`)) return;
    await supabase.from("blog_posts").delete().eq("id", post.id);
    router.refresh();
  }

  /* ── FORM VIEW ─────────────────────────────── */
  if (showForm) {
    return (
      <div className="rounded-xl border border-edge bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-edge px-6 py-4">
          <h3 className="font-bold text-ink">
            {editing ? "Edytuj post" : "Nowy post"}
          </h3>
          <button
            onClick={cancelForm}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            ← Anuluj
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              <span className="text-ink-faint font-normal">(auto-generowany z tytułu)</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="jak-wycenic-sklep-internetowy"
            />
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
              placeholder="Krótkie podsumowanie artykułu (150–200 znaków)..."
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
              rows={15}
              placeholder="<h2>Nagłówek</h2><p>Treść artykułu...</p>"
              className="font-mono text-xs resize-y"
            />
            <p className="mt-1 text-xs text-ink-faint">
              Dostępne tagi HTML:{" "}
              <code className="bg-bg-section px-1 rounded">&lt;h2&gt;</code>{" "}
              <code className="bg-bg-section px-1 rounded">&lt;h3&gt;</code>{" "}
              <code className="bg-bg-section px-1 rounded">&lt;p&gt;</code>{" "}
              <code className="bg-bg-section px-1 rounded">&lt;ul&gt;</code>{" "}
              <code className="bg-bg-section px-1 rounded">&lt;li&gt;</code>{" "}
              <code className="bg-bg-section px-1 rounded">&lt;strong&gt;</code>
            </p>
          </div>

          {/* Kategoria + Autor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Kategoria</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
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
                URL zdjęcia głównego{" "}
                <span className="text-ink-faint font-normal">(opcjonalnie)</span>
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
                <span className="text-ink-faint font-normal">(oddzielone przecinkami)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="e-commerce, wycena, sprzedaż"
              />
            </div>
          </div>

          {/* Opublikuj */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 accent-violet"
            />
            <span className="text-sm font-medium text-ink">Opublikuj od razu</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-violet !py-2.5 disabled:opacity-60">
              {saving ? "Zapisywanie..." : editing ? "Zapisz zmiany" : "Utwórz post"}
            </button>
            <button type="button" onClick={cancelForm} className="btn-outline-violet !py-2.5">
              Anuluj
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ── LIST VIEW ─────────────────────────────── */
  return (
    <div className="rounded-xl border border-edge bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-edge px-6 py-4">
        <h3 className="font-bold text-ink">
          Posty na blogu{" "}
          <span className="ml-1 rounded-full bg-bg-section px-2 py-0.5 text-xs font-medium text-ink-faint">
            {posts.length}
          </span>
        </h3>
        <button onClick={openCreate} className="btn-violet text-sm !py-2 !px-4">
          <Plus size={15} />
          Nowy post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="py-14 text-center text-ink-muted">
          <p className="mb-3 text-3xl">📝</p>
          <p>Brak postów. Stwórz pierwszy artykuł.</p>
        </div>
      ) : (
        <div className="divide-y divide-edge">
          {posts.map((post) => (
            <div key={post.id} className="flex items-start gap-4 p-5 hover:bg-bg-section transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
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
                <h4 className="font-semibold text-ink truncate">{post.title}</h4>
                <p className="text-sm text-ink-muted mt-0.5 line-clamp-1">{post.excerpt}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-violet-lighter hover:text-violet transition-colors"
                    title="Podgląd"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => togglePublish(post)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-violet-lighter hover:text-violet transition-colors"
                  title={post.published ? "Ukryj" : "Opublikuj"}
                >
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-violet-lighter hover:text-violet transition-colors"
                  title="Edytuj"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deletePost(post)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Usuń"
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
