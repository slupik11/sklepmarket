import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/ListingCard";
import ListingFilters from "@/components/ListingFilters";
import type { Listing } from "@/lib/supabase/types";

const PAGE_SIZE = 9;

interface SearchParams {
  category?: string;
  platform?: string;
  price?: string;
  revenue?: string;
  sort?: string;
  page?: string;
}

async function getListings(params: SearchParams) {
  const supabase = createClient();
  let query = supabase.from("listings").select("*", { count: "exact" }).eq("status", "active");

  if (params.category) query = query.eq("category", params.category);
  if (params.platform) query = query.eq("platform", params.platform);

  if (params.price) {
    const [min, max] = params.price.split("-");
    if (min) query = query.gte("asking_price", Number(min));
    if (max) query = query.lte("asking_price", Number(max));
  }
  if (params.revenue) {
    const [min, max] = params.revenue.split("-");
    if (min) query = query.gte("monthly_revenue", Number(min));
    if (max) query = query.lte("monthly_revenue", Number(max));
  }

  const sort = params.sort || "newest";
  if (sort === "price_asc") query = query.order("asking_price", { ascending: true });
  else if (sort === "price_desc") query = query.order("asking_price", { ascending: false });
  else if (sort === "revenue_desc") query = query.order("monthly_revenue", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data, count } = await query;
  return { listings: (data ?? []) as Listing[], total: count ?? 0, page };
}

export default async function OffersPage({ searchParams }: { searchParams: SearchParams }) {
  const { listings, total, page } = await getListings(searchParams);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const countLabel = total === 1 ? "oferta" : total > 1 && total < 5 ? "oferty" : "ofert";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-violet">Marketplace</p>
        <h1 className="headline-md text-ink">Sklepy na sprzedaż</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          {total} {countLabel} dostępnych · Weryfikowane dane finansowe
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-60 flex-shrink-0">
          <div className="rounded-xl border border-edge bg-white p-5 shadow-card lg:sticky lg:top-20">
            <Suspense>
              <ListingFilters />
            </Suspense>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-edge bg-bg-section">
              <div className="text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium text-ink">Brak pasujących ofert</p>
                <p className="text-sm text-ink-muted mt-1">Spróbuj zmienić filtry.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: SearchParams;
}) {
  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(p));
    return `/oferty?${params.toString()}`;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      {page > 1 && (
        <a href={buildHref(page - 1)} className="rounded-lg border border-edge px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-violet/40 hover:text-violet">
          ← Poprzednia
        </a>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => Math.abs(p - page) <= 2)
        .map((p) => (
          <a
            key={p}
            href={buildHref(p)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              p === page
                ? "violet-gradient-bg text-white shadow-violet"
                : "border border-edge text-ink-muted hover:border-violet/40 hover:text-violet"
            }`}
          >
            {p}
          </a>
        ))}
      {page < totalPages && (
        <a href={buildHref(page + 1)} className="rounded-lg border border-edge px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-violet/40 hover:text-violet">
          Następna →
        </a>
      )}
    </div>
  );
}
