import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Tag, TrendingUp, Clock, BarChart2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Badge from "@/components/Badge";
import MetricCard from "@/components/MetricCard";
import ListingCard from "@/components/ListingCard";
import ContactForm from "@/components/ContactForm";
import { formatPrice, formatRevenue, formatAge } from "@/lib/utils";
import type { Listing } from "@/lib/supabase/types";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("listings").select("title, description").eq("slug", params.slug).single();
  if (!data) return { title: "Oferta nie znaleziona" };
  return {
    title: `${data.title} — SklepMarket.pl`,
    description: data.description.slice(0, 160),
  };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const [{ data: listing }, { data: similar }] = await Promise.all([
    supabase.from("listings").select("*").eq("slug", params.slug).single(),
    supabase.from("listings").select("*").eq("status", "active").limit(4),
  ]);

  if (!listing) notFound();
  const l = listing as Listing;
  const roi = l.monthly_revenue > 0 ? Math.round(l.asking_price / l.monthly_revenue) : null;
  const similarListings = (similar ?? []).filter((s) => s.id !== l.id).slice(0, 3) as Listing[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-ink-muted">
        <Link href="/oferty" className="flex items-center gap-1.5 hover:text-violet transition-colors">
          <ArrowLeft size={14} />
          Powrót do ofert
        </Link>
        <span>/</span>
        <span className="text-ink truncate max-w-[200px]">{l.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-bg-section border border-edge aspect-video">
            {l.images && l.images.length > 0 ? (
              <Image src={l.images[0]} alt={l.title} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center flex-col gap-3">
                <span className="text-7xl">🏪</span>
                <span className="text-sm text-ink-muted">Brak zdjęcia</span>
              </div>
            )}
            {l.status === "sold" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <Badge variant="sold" className="text-base px-5 py-2" />
              </div>
            )}
          </div>

          {/* Title & badges */}
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="category" label={l.category} />
              <Badge variant="platform" label={l.platform} />
              {l.verified && <Badge variant="verified" />}
            </div>
            <h1 className="text-3xl font-bold text-ink sm:text-4xl">{l.title}</h1>
          </div>

          {/* Verified banner */}
          {l.verified && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-violet/20 bg-violet-lighter p-4">
              <ShieldCheck size={22} className="text-violet flex-shrink-0" />
              <div>
                <p className="font-semibold text-violet">Zweryfikowany przez SklepMarket.pl</p>
                <p className="text-sm text-ink-muted">Dane finansowe zostały zweryfikowane przez nasz team.</p>
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard icon={Tag} label="Cena sprzedaży" value={formatPrice(l.asking_price)} highlight />
            <MetricCard icon={TrendingUp} label="Przychód / mies." value={formatRevenue(l.monthly_revenue)} />
            <MetricCard icon={Clock} label="Wiek sklepu" value={formatAge(l.age_months)} />
            {roi && <MetricCard icon={BarChart2} label="Zwrot inwestycji" value={`${roi} mies.`} />}
          </div>

          {/* Description */}
          <div className="rounded-xl border border-edge bg-white p-6 shadow-card">
            <h2 className="mb-4 text-xl font-bold text-ink">Opis sklepu</h2>
            <div className="space-y-3 text-sm text-ink-muted leading-relaxed">
              {l.description.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-5">
            {/* Price card */}
            <div className="rounded-xl border border-violet/20 bg-violet-lighter p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet/60 mb-1">Cena sprzedaży</p>
              <p className="text-3xl font-bold text-violet mb-1">{formatPrice(l.asking_price)}</p>
              {l.monthly_revenue > 0 && (
                <p className="text-sm text-ink-muted">Przychód: {formatRevenue(l.monthly_revenue)}</p>
              )}
            </div>

            {/* Contact form */}
            {l.status !== "sold" ? (
              <div className="rounded-xl border border-edge bg-white p-5 shadow-card">
                <h3 className="mb-4 text-lg font-bold text-ink">Zapytaj o sklep</h3>
                <ContactForm listingId={l.id} />
              </div>
            ) : (
              <div className="rounded-xl border border-edge bg-bg-section p-6 text-center">
                <p className="text-ink-muted text-sm">Ten sklep został już sprzedany.</p>
                <Link href="/oferty" className="mt-3 inline-block text-sm font-medium text-violet hover:text-violet-hover">
                  Zobacz inne oferty →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar */}
      {similarListings.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-ink">Podobne oferty</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarListings.map((s) => (
              <ListingCard key={s.id} listing={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
