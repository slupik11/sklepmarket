import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "SklepMarket.pl — Kup lub sprzedaj gotowy sklep internetowy",
  description:
    "Platforma premium do transakcji gotowymi sklepami internetowymi. Kupuj działające biznesy e-commerce z pełną instrukcją. Sprzedawaj dyskretnie z ochroną NDA.",
  keywords: "kupno sklepu internetowego, sprzedaż sklepu, marketplace e-commerce, sklep na sprzedaż, M&A e-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body className={`${inter.className} bg-bg text-ink antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
