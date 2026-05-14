import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Play,
  CheckCircle,
  Lock,
  Phone,
  BarChart2,
  FileSignature,
  HeartHandshake,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/ListingCard";
import { formatPriceCompact } from "@/lib/utils";
import type { Listing } from "@/lib/supabase/types";

async function getHomeData() {
  const supabase = createClient();
  const [{ data: listings }, { data: all }] = await Promise.all([
    supabase.from("listings").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(6),
    supabase.from("listings").select("id, asking_price, status, verified"),
  ]);
  const active = all?.filter((l) => l.status === "active") ?? [];
  return {
    listings: (listings ?? []) as Listing[],
    stats: {
      active: active.length,
      value: active.reduce((s, l) => s + l.asking_price, 0),
      verified: active.filter((l) => l.verified).length,
    },
  };
}

export default async function HomePage() {
  const { listings, stats } = await getHomeData();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://sklepmarket.pl/#website",
        "url": "https://sklepmarket.pl",
        "name": "SklepMarket.pl",
        "description": "Marketplace sklepów internetowych w Polsce",
        "inLanguage": "pl-PL",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://sklepmarket.pl/oferty?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://sklepmarket.pl/#organization",
        "name": "SklepMarket.pl",
        "url": "https://sklepmarket.pl",
        "logo": { "@type": "ImageObject", "url": "https://sklepmarket.pl/logo.png" },
        "contactPoint": { "@type": "ContactPoint", "email": "kontakt@sklepmarket.pl", "contactType": "customer service" },
        "sameAs": [],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ═══════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="relative dark-gradient-bg overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet/10 blur-[120px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Headline */}
          <h1 className="animate-fade-in headline-xl text-white mb-5 max-w-3xl" style={{ animationFillMode: "both" }}>
            Kupuj i sprzedawaj{" "}
            <span className="shimmer-text">gotowe sklepy</span>{" "}
            internetowe
          </h1>

          {/* Subtext */}
          <p
            className="animate-fade-in delay-100 text-lg text-on-dark-faint leading-relaxed max-w-xl mb-10"
            style={{ animationFillMode: "both", opacity: 0 }}
          >
            Sprawdzone biznesy e-commerce z udokumentowanymi przychodami. Pełna dokumentacja,
            wsparcie po transakcji i NDA dla sprzedających.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in delay-200 flex flex-wrap gap-3 mb-14"
            style={{ animationFillMode: "both", opacity: 0 }}
          >
            <Link href="/oferty" className="btn-white-on-dark">
              Przeglądaj oferty <ArrowRight size={17} />
            </Link>
            <Link href="/sprzedaj" className="btn-ghost-on-dark">
              Sprzedaj swój sklep
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-in delay-300 grid grid-cols-3 divide-x divide-on-dark-faint/20 border border-on-dark-faint/20 rounded-xl overflow-hidden max-w-lg"
            style={{ animationFillMode: "both", opacity: 0 }}
          >
            {[
              { value: stats.active.toString(), label: "Aktywnych ofert" },
              { value: formatPriceCompact(stats.value), label: "Łączna wartość" },
              { value: stats.verified.toString(), label: "Zweryfikowanych" },
            ].map((s, i) => (
              <div key={i} className="card-dark px-4 py-4 sm:px-6 sm:py-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-on-dark-muted mb-1">
                  {s.label}
                </p>
                <p className="text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SPLIT: Kupujący | Sprzedający
      ════════════════════════════════════ */}
      <section className="border-b border-edge">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-edge">

            {/* Dla kupujących */}
            <div className="px-8 py-14 lg:px-12">
              <div className="mb-1 text-xs font-bold uppercase tracking-widest text-violet">Kupujący</div>
              <h2 className="headline-md text-ink mb-4">
                Inwestujesz w działający biznes
              </h2>
              <p className="text-ink-muted leading-relaxed mb-8 max-w-md">
                Kupujesz sklep z historią sprzedaży, sprawdzonymi dostawcami
                i gotową bazą klientów — nie projekt, nie pomysł.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: <CheckCircle size={18} className="text-violet mt-0.5 flex-shrink-0" />,
                    title: "Działający sklep z przychodami",
                    desc: "Weryfikowane dane finansowe, dostęp do Analytics przed zakupem.",
                  },
                  {
                    icon: <Play size={18} className="text-violet mt-0.5 flex-shrink-0" />,
                    title: "Film instruktażowy 2h",
                    desc: "Szczegółowy kurs jak prowadzić sklep od pierwszego dnia.",
                  },
                  {
                    icon: <TrendingUp size={18} className="text-violet mt-0.5 flex-shrink-0" />,
                    title: "Konfiguracja kampanii reklamowych",
                    desc: "Instrukcja ustawienia Meta Ads i Google Ads pod ten konkretny sklep.",
                  },
                  {
                    icon: <ShieldCheck size={18} className="text-violet mt-0.5 flex-shrink-0" />,
                    title: "Wsparcie po transakcji",
                    desc: "Jesteśmy dostępni przez pierwsze 30 dni po przejęciu.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    {item.icon}
                    <div>
                      <p className="font-semibold text-ink text-sm">{item.title}</p>
                      <p className="text-sm text-ink-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/oferty" className="btn-violet text-sm">
                Zobacz dostępne sklepy <ArrowRight size={16} />
              </Link>
            </div>

            {/* Dla sprzedających */}
            <div className="section-bg px-8 py-14 lg:px-12 relative overflow-hidden">
              <div aria-hidden className="absolute top-0 right-0 w-40 h-40 bg-violet/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-violet">Sprzedający</div>
                <h2 className="headline-md text-ink mb-4">
                  Sprzedaj dyskretnie i bezpiecznie
                </h2>
                <p className="text-ink-muted leading-relaxed mb-8 max-w-md">
                  Nie publikujesz publicznie. Podpisujesz NDA już przy pierwszym kontakcie.
                  Działamy poufnie na każdym etapie.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { step: "01", text: "Wypełniasz krótki formularz" },
                    { step: "02", text: "Oddzwaniamy do Ciebie w 24h" },
                    { step: "03", text: "Umawiamy spotkanie" },
                    { step: "04", text: "Podpisujemy NDA" },
                    { step: "05", text: "Działamy razem" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <span className="flex-shrink-0 font-mono text-xs font-bold text-violet bg-violet-lighter rounded-md px-2 py-0.5">
                        {s.step}
                      </span>
                      <span className="text-sm text-ink">{s.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-6 text-xs text-ink-muted">
                  <Lock size={12} className="text-violet" />
                  Pełna poufność · NDA przy pierwszym kontakcie
                </div>

                <Link href="/sprzedaj" className="btn-violet text-sm">
                  Skontaktuj się z nami <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          LISTINGS
      ════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-violet">Marketplace</p>
            <h2 className="headline-md text-ink">Aktualne oferty</h2>
          </div>
          <Link href="/oferty" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-violet hover:text-violet-hover transition-colors">
            Wszystkie <ArrowRight size={15} />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-xl border border-edge bg-bg-section">
            <p className="text-ink-muted">Brak aktywnych ofert — sprawdź wkrótce.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════
          TRUST — dlaczego my
      ════════════════════════════════════ */}
      <section className="border-t border-edge section-bg">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet">Dlaczego SklepMarket</p>
              <h2 className="headline-md text-ink mb-4">
                Nie jesteśmy kolejnym marketplace&rsquo;em
              </h2>
              <p className="text-ink-muted leading-relaxed">
                Mamy wieloletnie doświadczenie w branży e-commerce. Wiemy czego szukać,
                jak weryfikować dane i jak przeprowadzać transakcje, które działają dla obu stron.
              </p>
            </div>

            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <FileSignature size={20} className="text-violet" />,
                  title: "NDA przy każdej transakcji",
                  desc: "Dane sprzedającego i kupującego są chronione umową o zachowaniu poufności.",
                },
                {
                  icon: <BarChart2 size={20} className="text-violet" />,
                  title: "Weryfikacja finansów",
                  desc: "Sprawdzamy Google Analytics, przychody i historię zamówień przed publikacją.",
                },
                {
                  icon: <Play size={20} className="text-violet" />,
                  title: "Instrukcja + film 2h",
                  desc: "Kupujący dostaje szczegółowy kurs jak przejąć i prowadzić sklep od pierwszego dnia.",
                },
                {
                  icon: <HeartHandshake size={20} className="text-violet" />,
                  title: "Wsparcie post-transakcyjne",
                  desc: "Jesteśmy dostępni przez 30 dni po finalizacji — pytania, problemy, konfiguracja.",
                },
              ].map((item) => (
                <div key={item.title} className="card p-5 hover:border-violet/30 hover:shadow-card-hover transition-all duration-200">
                  <div className="mb-3">{item.icon}</div>
                  <h3 className="font-bold text-ink text-sm mb-1.5">{item.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA DARK — sprzedaj sklep
      ════════════════════════════════════ */}
      <section className="dark-gradient-bg relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }} />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-violet/8 blur-[100px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-dark-muted">
                <Lock size={12} /> Poufna wycena · Bez zobowiązań
              </div>
              <h2 className="headline-lg text-white mb-3">
                Chcesz sprzedać sklep?
              </h2>
              <p className="text-on-dark-faint leading-relaxed">
                Wypełnij formularz. Oddzwaniamy w ciągu 24 godzin.
                Nie musisz podawać nazwy sklepu — możesz być anonimowy do momentu podpisania NDA.
              </p>
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/sprzedaj" className="btn-white-on-dark">
                Wyślij zgłoszenie <ArrowRight size={17} />
              </Link>
              <div className="flex items-center gap-2 text-xs text-on-dark-faint">
                <Phone size={12} />
                Preferujesz telefon? Napisz numer — oddzwonimy.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SEO CONTENT
      ════════════════════════════════════ */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="headline-md text-ink mb-4">
            Marketplace Sklepów Internetowych — Kup lub Sprzedaj Sklep Online
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-sm text-ink-muted leading-relaxed">
            <div>
              <h3 className="font-bold text-ink mb-3 text-base">Dlaczego warto kupić gotowy sklep?</h3>
              <p className="mb-4">
                Kupno gotowego sklepu internetowego to najszybsza droga do biznesu e-commerce.
                Na SklepMarket.pl znajdziesz zweryfikowane sklepy z udokumentowanymi przychodami,
                sprawdzoną bazą klientów i działającymi kanałami sprzedaży.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Natychmiastowy start — sklep generuje przychody od pierwszego dnia",
                  "Zweryfikowane dane finansowe przed zakupem",
                  "Film instruktażowy 2h + konfiguracja kampanii reklamowych",
                  "Wsparcie po transakcji przez 30 dni",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-violet mt-0.5 flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-3 text-base">Popularne kategorie sklepów</h3>
              <ul className="space-y-1.5 mb-4">
                {[
                  "Sklepy dropshipping — biznes bez magazynu",
                  "Sklepy Shopify — gotowe platformy z integracjami",
                  "Sklepy WooCommerce — pełna kontrola oparta na WordPress",
                  "Sklepy z kosmetykami, elektroniką, akcesoriami domowymi",
                  "Sklepy z produktami cyfrowymi — automatyczna sprzedaż 24/7",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-violet mt-0.5 flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <h3 className="font-bold text-ink mb-2 text-base">Jak sprzedać sklep?</h3>
              <p>
                Proces jest prosty i dyskretny. Wypełniasz krótki formularz, my oddzwaniamy
                w 24h, umawiamy spotkanie i podpisujemy NDA — dopiero wtedy rozmawiamy o detalach.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 text-sm text-ink-muted leading-relaxed mt-10 pt-10 border-t border-edge">
            <div>
              <h3 className="font-bold text-ink mb-3 text-base">Ile kosztuje gotowy sklep online?</h3>
              <p className="mb-3">
                Ceny sklepów internetowych zależą od wielu czynników: miesięcznego przychodu,
                marży, historii, platformy i potencjału wzrostu. Typowy zakres to
                <strong className="text-ink"> 20–60-krotność</strong> miesięcznego zysku netto.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Małe sklepy (do 5k/mies.) — od 30 000 do 100 000 zł",
                  "Średnie sklepy (5–20k/mies.) — od 100 000 do 400 000 zł",
                  "Duże sklepy (20k+/mies.) — od 400 000 zł wzwyż",
                  "Wycena bezpłatna — skontaktuj się z nami",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-violet mt-0.5 flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-3 text-base">Dlaczego SklepMarket, nie samodzielna sprzedaż?</h3>
              <p className="mb-3">
                Samodzielna sprzedaż sklepu zajmuje średnio 6–12 miesięcy i wiąże się z ryzykiem
                spotkania niezdecydowanych kupujących lub oszustów. My weryfikujemy kupujących,
                pośredniczymy w transakcji i zapewniamy bezpieczeństwo obu stron.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Baza sprawdzonych kupujących gotowych do inwestycji",
                  "NDA i obsługa prawna przy każdej transakcji",
                  "Średni czas sprzedaży 30–60 dni",
                  "Pełna dyskrecja — nikt nie dowie się, że sprzedajesz",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-violet mt-0.5 flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
