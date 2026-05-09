import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Clock, MessageSquare } from "lucide-react";

const BUYER_STEPS = [
  { n: "01", title: "Przeglądaj oferty", desc: "Korzystaj z zaawansowanych filtrów — wybierz kategorię, platformę, przedział cenowy i minimalny przychód. Każda oferta zawiera kluczowe metryki finansowe." },
  { n: "02", title: "Zapoznaj się ze szczegółami", desc: "Na stronie oferty znajdziesz pełny opis biznesu, historię przychodów, wiek sklepu i szacowany czas zwrotu inwestycji (ROI)." },
  { n: "03", title: "Wyślij zapytanie", desc: "Formularz kontaktowy jest dostępny bezpośrednio na stronie oferty. Skontaktujemy Cię ze sprzedającym i pośredniczymy w komunikacji." },
  { n: "04", title: "Due diligence", desc: "Pomagamy w weryfikacji danych — dostęp do Google Analytics, raportów finansowych, kont dostawców. Nic nie kupisz w ciemno." },
  { n: "05", title: "Transakcja i przekazanie", desc: "Finalizujemy transakcję w bezpieczny sposób. Zapewniamy przekazanie wszystkich zasobów: domeny, kont, dostawców, know-how." },
];

const SELLER_STEPS = [
  { n: "01", title: "Wypełniasz krótki formularz", desc: "Tylko imię i kontakt (telefon lub email). Nie musisz podawać nazwy sklepu — możesz być w pełni anonimowy." },
  { n: "02", title: "My oddzwaniamy", desc: "W ciągu 24 godzin roboczych kontaktujemy się z Tobą. Ustalamy termin rozmowy który Ci odpowiada." },
  { n: "03", title: "Umawiamy spotkanie", desc: "Krótka rozmowa online lub telefonicznie. Bez presji, bez zobowiązań — omawiamy ogólny zarys sytuacji." },
  { n: "04", title: "Podpisujemy NDA", desc: "Przed rozmową o detalach podpisujemy razem umowę o zachowaniu poufności. Twoje dane są bezpieczne." },
  { n: "05", title: "Działamy razem", desc: "Wyceniamy sklep, przygotowujemy ofertę, szukamy kupców z naszej bazy i przeprowadzamy bezpieczną transakcję." },
];

const FAQ = [
  { q: "Czy wystawienie sklepu jest płatne?", a: "Nie — wystawienie jest całkowicie bezpłatne. Pobieramy prowizję wyłącznie w przypadku pomyślnej sprzedaży." },
  { q: "Jak długo trwa sprzedaż?", a: "Średni czas sprzedaży to 30–90 dni, w zależności od ceny i kategorii sklepu. Sklepy z weryfikowanymi przychodami sprzedają się szybciej." },
  { q: "Jak weryfikujecie dane finansowe?", a: "Prosimy o dostęp do konta Google Analytics, panelu płatności (np. Stripe, PayU) i systemu zamówień. Weryfikacja zajmuje 1-2 dni robocze." },
  { q: "Czy muszę ujawniać nazwę sklepu?", a: "Nie — możesz być całkowicie anonimowy aż do podpisania NDA. Formularz wymaga tylko imienia i kontaktu. Szczegóły omawiamy dopiero po podpisaniu umowy poufności." },
  { q: "Jaką prowizję pobieracie?", a: "Prowizja ustalana jest indywidualnie w zależności od wartości i specyfiki transakcji. Wycena i pierwsza konsultacja są bezpłatne." },
  { q: "Co wchodzi w skład przekazania sklepu?", a: "Domena, hosting, kod źródłowy, konta w serwisach (Google Ads, Meta, email marketing), baza klientów, relacje z dostawcami i pełna dokumentacja handoff." },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-20 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet">Przewodnik</p>
        <h1 className="mb-4 text-4xl font-bold text-ink sm:text-5xl">Jak to działa?</h1>
        <p className="mx-auto max-w-2xl text-lg text-ink-muted">
          Przejrzysty proces dla obu stron. Kupuj i sprzedawaj sklepy internetowe bezpiecznie i sprawnie.
        </p>
      </div>

      {/* Trust indicators */}
      <div className="mb-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: <ShieldCheck className="text-violet" size={22} />, label: "Weryfikowane dane", desc: "Każda oferta weryfikowana ręcznie" },
          { icon: <TrendingUp className="text-violet" size={22} />, label: "Realne przychody", desc: "Dostęp do raportów finansowych" },
          { icon: <Clock className="text-violet" size={22} />, label: "24h odpowiedź", desc: "Szybki kontakt z naszym teamem" },
          { icon: <MessageSquare className="text-violet" size={22} />, label: "Pełna pomoc", desc: "Pośredniczymy na każdym etapie" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-edge bg-white p-5 text-center shadow-card">
            <div className="mb-3 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-lighter">
                {item.icon}
              </div>
            </div>
            <p className="font-semibold text-ink text-sm">{item.label}</p>
            <p className="mt-1 text-xs text-ink-muted">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Buyer steps */}
      <section className="mb-20">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-violet-lighter px-3 py-1 text-sm font-semibold text-violet mb-3">
            Dla kupującego
          </span>
          <h2 className="text-3xl font-bold text-ink">Jak kupić sklep?</h2>
        </div>
        <div className="space-y-3">
          {BUYER_STEPS.map((step) => (
            <div key={step.n} className="flex gap-5 rounded-xl border border-edge bg-white p-6 shadow-card hover:border-violet/20 hover:shadow-card-hover transition-all duration-200">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full violet-gradient-bg text-sm font-bold text-white">
                {step.n}
              </div>
              <div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/oferty" className="btn-violet">
            Przeglądaj oferty <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Seller steps */}
      <section className="mb-20">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-violet-lighter px-3 py-1 text-sm font-semibold text-violet mb-3">
            Dla sprzedającego
          </span>
          <h2 className="text-3xl font-bold text-ink">Jak sprzedać sklep?</h2>
        </div>
        <div className="space-y-3">
          {SELLER_STEPS.map((step) => (
            <div key={step.n} className="flex gap-5 rounded-xl border border-edge bg-white p-6 shadow-card hover:border-violet/20 hover:shadow-card-hover transition-all duration-200">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full violet-gradient-bg text-sm font-bold text-white">
                {step.n}
              </div>
              <div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/sprzedaj" className="btn-outline-violet">
            Skontaktuj się — to nic nie kosztuje <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet">FAQ</p>
          <h2 className="text-3xl font-bold text-ink">Najczęstsze pytania</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-2">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-xl border border-edge bg-white shadow-card overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-ink hover:text-violet transition-colors list-none select-none">
                {item.q}
                <span className="ml-4 flex-shrink-0 text-violet-DEFAULT text-ink-muted transition-transform duration-200 group-open:rotate-180">▾</span>
              </summary>
              <div className="border-t border-edge px-5 pb-5 pt-4">
                <p className="text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
