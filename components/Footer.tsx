import Link from "next/link";

export default function Footer() {
  return (
    <footer className="dark-gradient-bg text-on-dark mt-0">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                Sklep<span className="text-violet-glow">Market</span><span className="text-on-dark-faint font-medium">.pl</span>
              </span>
            </Link>
            <p className="text-sm text-on-dark-faint leading-relaxed max-w-xs">
              Platforma premium do kupna i sprzedaży gotowych sklepów internetowych.
              Dyskrecja, NDA, profesjonalizm na każdym etapie.
            </p>
            <p className="mt-4 text-sm text-on-dark-faint">
              kontakt@sklepmarket.pl
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-on-dark-muted">Platforma</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/oferty", label: "Przeglądaj oferty" },
                { href: "/jak-to-dziala", label: "Jak to działa" },
                { href: "/o-nas", label: "O nas" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-on-dark-faint transition-colors hover:text-on-dark">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell CTA */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-on-dark-muted">Sprzedaj sklep</h3>
            <p className="text-sm text-on-dark-faint mb-4 leading-relaxed">
              Dyskretny proces, NDA, profesjonalna wycena.
            </p>
            <Link href="/sprzedaj" className="btn-white-on-dark text-sm !py-2.5 !px-5">
              Skontaktuj się →
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-on-dark-faint/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-on-dark-faint">
            © {new Date().getFullYear()} SklepMarket.pl — Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-5 text-xs text-on-dark-faint">
            <span className="cursor-default hover:text-on-dark transition-colors">Regulamin</span>
            <span className="cursor-default hover:text-on-dark transition-colors">Polityka prywatności</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
