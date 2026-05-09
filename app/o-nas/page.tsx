import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "O nas — SklepMarket.pl",
  description: "Poznaj zespół SklepMarket.pl — platformy premium do kupna i sprzedaży gotowych sklepów internetowych.",
};

export default function ONasPage() {
  return (
    <>
      {/* Hero */}
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
        <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet/10 blur-[120px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-glow/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-glow">
            O nas
          </div>
          <h1 className="headline-xl text-white mb-5 mx-auto max-w-2xl">
            Kim jesteśmy
          </h1>
          <p className="text-lg text-on-dark-faint leading-relaxed mx-auto max-w-xl">
            Sekcja w przygotowaniu. Wróć wkrótce — opiszemy nasz zespół
            i doświadczenie w branży e-commerce.
          </p>
        </div>
      </section>

      {/* Content placeholder */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-2xl border border-violet/20 bg-violet-lighter px-10 py-14 max-w-lg w-full">
            <div className="text-5xl mb-5">🚧</div>
            <h2 className="text-2xl font-black text-ink tracking-tight mb-3">
              Sekcja w przygotowaniu
            </h2>
            <p className="text-ink-muted leading-relaxed mb-7">
              Pracujemy nad szczegółowym opisem naszego zespołu i historii.
              W międzyczasie możesz sprawdzić nasze oferty lub skontaktować się z nami bezpośrednio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/oferty" className="btn-violet text-sm">
                Zobacz oferty <ArrowRight size={15} />
              </Link>
              <Link href="/sprzedaj" className="btn-outline-violet text-sm">
                Skontaktuj się
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-ink-faint mt-2">
            <Lock size={12} className="text-violet" />
            kontakt@sklepmarket.pl
          </div>
        </div>
      </section>
    </>
  );
}
