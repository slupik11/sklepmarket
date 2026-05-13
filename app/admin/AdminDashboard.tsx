import { createClient } from "@/lib/supabase/server";
import AdminTabs from "./AdminTabs";
import { adminLogout } from "./login/actions";
import { Store } from "lucide-react";
import type { Listing, Inquiry, SellRequest, BlogPost } from "@/lib/supabase/types";

export default async function AdminDashboard() {
  const supabase = createClient();
  const [
    { data: listings },
    { data: inquiries },
    { data: sellRequests },
    { data: blogPosts },
  ] = await Promise.all([
    supabase.from("listings").select("*").order("created_at", { ascending: false }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("sell_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
  ]);

  const l = (listings ?? []) as Listing[];
  const inq = (inquiries ?? []) as Inquiry[];
  const sr = (sellRequests ?? []) as SellRequest[];
  const bp = (blogPosts ?? []) as BlogPost[];

  const stats = [
    {
      label: "Aktywne oferty",
      value: l.filter((x) => x.status === "active").length,
      sub: `z ${l.length} całkowitych`,
      color: "text-violet",
    },
    {
      label: "Nieobsłużone zapytania",
      value: inq.filter((x) => !x.handled).length,
      sub: `z ${inq.length} całkowitych`,
      color: "text-violet",
    },
    {
      label: "Nowe zgłoszenia sprzedaży",
      value: sr.filter((x) => x.status === "new").length,
      sub: `z ${sr.length} całkowitych`,
      color: "text-amber-600",
    },
    {
      label: "Opublikowane posty",
      value: bp.filter((x) => x.published).length,
      sub: `z ${bp.length} całkowitych`,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-section">
      {/* Admin header */}
      <div className="border-b border-edge bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg violet-gradient-bg">
                <Store size={16} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-ink">
                  Sklep<span className="text-violet">Market</span>.pl
                </span>
                <span className="ml-2 rounded-md bg-violet-lighter px-2 py-0.5 text-xs font-medium text-violet">
                  Admin
                </span>
              </div>
            </div>
            <form action={adminLogout}>
              <button type="submit" className="text-sm text-ink-muted hover:text-ink transition-colors">
                Wyloguj →
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats — 4 cards */}
        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-edge bg-white p-5 shadow-card">
              <p className="text-xs font-semibold text-ink-faint mb-2 leading-tight">{s.label}</p>
              <p className={`text-3xl font-black tracking-tight ${s.color}`}>{s.value}</p>
              <p className="text-xs text-ink-faint mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <AdminTabs
          listings={l}
          inquiries={inq}
          sellRequests={sr}
          blogPosts={bp}
        />
      </div>
    </div>
  );
}
