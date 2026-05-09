import { ArrowRight, Lock, Shield, Eye, Clock, Phone } from "lucide-react";
import SellerContactForm from "@/components/SellerContactForm";

const TRUST = [
  {
    icon: <Lock size={20} className="text-violet" />,
    title: "Pełna poufność",
    desc: "Nie ujawniamy Twoich danych bez Twojej zgody. Możesz być anonimowy aż do podpisania NDA.",
  },
  {
    icon: <Shield size={20} className="text-violet" />,
    title: "NDA na starcie",
    desc: "Umowę o zachowaniu poufności podpisujemy razem przy pierwszym kontakcie — zanim powiesz cokolwiek o sklepie.",
  },
  {
    icon: <Eye size={20} className="text-violet" />,
    title: "Bez publicznego ogłoszenia",
    desc: "Twój sklep nie trafia na żadną publiczną listę. Kupujący są sprawdzani i podpisują NDA.",
  },
  {
    icon: <Clock size={20} className="text-violet" />,
    title: "Kontakt w 24h",
    desc: "Oddzwaniamy w ciągu 24 godzin roboczych. Możesz wybrać termin który Ci odpowiada.",
  },
];

export default function SprzedajPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────── */}
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
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-violet/8 blur-[100px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-glow/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-glow">
              <Lock size={11} /> Poufna wycena · Bez zobowiązań
            </div>
            <h1 className="headline-xl text-white mb-5">
              Sprzedaj sklep{" "}
              <span className="shimmer-text">dyskretnie</span>
            </h1>
            <p className="text-lg text-on-dark-faint leading-relaxed mb-8 max-w-xl">
              Nie musisz podawać nazwy sklepu. Nie publikujemy ogłoszeń.
              Podpisujemy NDA przy pierwszym kontakcie — i dopiero wtedy rozmawiamy o szczegółach.
            </p>
            <div className="flex items-center gap-2 text-sm text-on-dark-muted">
              <Phone size={14} />
              Preferujesz telefon? Zostaw numer — oddzwonimy w ciągu 24h.
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* LEFT: Process + Trust */}
          <div className="lg:col-span-3 space-y-12">

            {/* Process */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet">Jak to działa</p>
              <h2 className="headline-sm text-ink mb-8">Prosty, dyskretny proces</h2>

              <div className="space-y-0">
                {[
                  {
                    step: "01",
                    title: "Wypełniasz krótki formularz",
                    desc: "Tylko imię i numer telefonu lub email. Nie musisz podawać nazwy sklepu ani żadnych szczegółów.",
                  },
                  {
                    step: "02",
                    title: "My oddzwaniamy",
                    desc: "W ciągu 24 godzin roboczych skontaktujemy się z Tobą. Ustalamy termin który pasuje.",
                  },
                  {
                    step: "03",
                    title: "Umawiamy spotkanie",
                    desc: "Krótka rozmowa — online lub telefonicznie. Bez presji, bez zobowiązań.",
                  },
                  {
                    step: "04",
                    title: "Podpisujemy NDA",
                    desc: "Przed rozmową o szczegółach podpisujemy razem umowę o zachowaniu poufności. Twoje dane są bezpieczne.",
                  },
                  {
                    step: "05",
                    title: "Działamy razem",
                    desc: "Wyceniamy sklep, szukamy kupców z bazy i przeprowadzamy bezpieczną transakcję.",
                  },
                ].map((s, i, arr) => (
                  <div key={s.step} className="flex gap-5 relative">
                    {/* Connector line */}
                    {i < arr.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-violet/20" />
                    )}
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-violet bg-violet-lighter z-10">
                      <span className="text-xs font-black text-violet">{s.step}</span>
                    </div>
                    <div className="pb-8">
                      <h3 className="font-bold text-ink mb-1">{s.title}</h3>
                      <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust grid */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet">Twoje bezpieczeństwo</p>
              <h2 className="headline-sm text-ink mb-6">Dyskrecja na każdym etapie</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {TRUST.map((t) => (
                  <div key={t.title} className="card p-5 hover:border-violet/30 hover:shadow-card-hover transition-all duration-200">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-lighter">
                      {t.icon}
                    </div>
                    <h3 className="font-bold text-ink text-sm mb-1.5">{t.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote / testimonial feel */}
            <div className="rounded-2xl border border-violet/20 bg-violet-lighter p-7">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">&ldquo;</div>
                <div>
                  <p className="text-ink leading-relaxed mb-3">
                    Sprzedający często boją się że informacja o sprzedaży dotrze do klientów lub konkurencji.
                    Dlatego cały nasz proces jest zaprojektowany tak, żebyś miał pełną kontrolę nad tym co i kiedy ujawniasz.
                  </p>
                  <p className="text-sm font-semibold text-violet">Zespół SklepMarket.pl</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-edge bg-white shadow-card-hover p-7">
              <div className="mb-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-violet">Zacznij teraz</p>
                <h2 className="text-xl font-black text-ink tracking-tight">Skontaktuj się z nami</h2>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                  Wystarczy imię i kontakt. Resztę omówimy na rozmowie.
                </p>
              </div>
              <SellerContactForm />
            </div>

            {/* Social proof / reassurance */}
            <div className="mt-4 flex flex-col gap-2.5 px-1">
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <Lock size={11} className="text-violet flex-shrink-0" />
                Dane są szyfrowane i nie udostępniane osobom trzecim
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <Shield size={11} className="text-violet flex-shrink-0" />
                NDA podpisujemy razem przy pierwszym kontakcie
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <Clock size={11} className="text-violet flex-shrink-0" />
                Odpowiadamy w ciągu 24 godzin roboczych
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM CTA ───────────────────────── */}
      <section className="border-t border-edge section-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet mb-1">Masz pytania?</p>
              <h3 className="text-xl font-black text-ink tracking-tight">Napisz bezpośrednio</h3>
              <p className="text-sm text-ink-muted mt-1">
                kontakt@sklepmarket.pl — odpowiadamy w ciągu 24h
              </p>
            </div>
            <a
              href="mailto:kontakt@sklepmarket.pl"
              className="btn-violet flex-shrink-0"
            >
              Napisz do nas <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
