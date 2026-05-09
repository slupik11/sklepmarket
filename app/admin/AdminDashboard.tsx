import { createClient } from "@/lib/supabase/server";
import AdminTabs from "./AdminTabs";
import { adminLogout } from "./login/actions";
import { Store } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();
  const [{ data: listings }, { data: inquiries }, { data: sellRequests }] = await Promise.all([
    supabase.from("listings").select("*").order("created_at", { ascending: false }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("sell_requests").select("*").order("created_at", { ascending: false }),
  ]);

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
                <span className="font-bold text-ink">Sklep<span className="text-violet">Market</span>.pl</span>
                <span className="ml-2 rounded-md bg-violet-lighter px-2 py-0.5 text-xs font-medium text-violet">Admin</span>
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
        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Oferty", value: listings?.length ?? 0, color: "text-violet" },
            { label: "Zapytania", value: inquiries?.length ?? 0, color: "text-emerald-600" },
            { label: "Zgłoszenia sprzedaży", value: sellRequests?.length ?? 0, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-edge bg-white p-5 text-center shadow-card">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <AdminTabs
          listings={listings ?? []}
          inquiries={inquiries ?? []}
          sellRequests={sellRequests ?? []}
        />
      </div>
    </div>
  );
}
