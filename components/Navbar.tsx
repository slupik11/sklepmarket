"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/oferty", label: "Oferty" },
  { href: "/jak-to-dziala", label: "Jak to działa" },
  { href: "/o-nas", label: "O nas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-edge bg-white/96 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-[1.15rem] font-black tracking-tight text-dark-surface leading-none">
              Sklep<span className="text-violet">Market</span><span className="text-ink-faint font-medium">.pl</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-violet",
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "text-violet"
                    : "text-ink-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sprzedaj" className="btn-violet text-sm !py-2 !px-5">
              Sprzedaj sklep
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-bg-section"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-edge bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-violet-lighter hover:text-violet",
                  pathname === l.href ? "bg-violet-lighter text-violet" : "text-ink-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-edge mt-2">
              <Link
                href="/sprzedaj"
                onClick={() => setOpen(false)}
                className="btn-violet w-full text-sm"
              >
                Sprzedaj sklep
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
