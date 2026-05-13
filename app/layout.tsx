import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400","500","600","700","800","900"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sklepmarket.pl"),
  title: {
    default: "SklepMarket.pl — Kup lub Sprzedaj Gotowy Sklep Internetowy",
    template: "%s | SklepMarket.pl",
  },
  description:
    "Marketplace sklepów internetowych w Polsce. Zweryfikowane sklepy e-commerce z udokumentowanymi przychodami. Bezpieczna transakcja, wsparcie prawne, pełna dyskrecja i NDA.",
  keywords: [
    "kup sklep internetowy",
    "sprzedaj sklep online",
    "marketplace e-commerce",
    "gotowy biznes online",
    "sklep Shopify na sprzedaż",
    "sklep dropshipping",
    "WooCommerce na sprzedaż",
    "biznes e-commerce Polska",
    "kupno sklepu internetowego",
    "M&A e-commerce Polska",
  ],
  authors: [{ name: "SklepMarket" }],
  creator: "SklepMarket",
  publisher: "SklepMarket",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://sklepmarket.pl",
    title: "SklepMarket.pl — Marketplace Sklepów Internetowych",
    description:
      "Kupuj i sprzedawaj zweryfikowane sklepy e-commerce. Bezpieczne transakcje, udokumentowane przychody, NDA przy każdej transakcji.",
    siteName: "SklepMarket",
  },
  twitter: {
    card: "summary_large_image",
    title: "SklepMarket.pl — Marketplace Sklepów Internetowych",
    description: "Kupuj i sprzedawaj zweryfikowane sklepy e-commerce. NDA, bezpieczeństwo, wsparcie na każdym etapie.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
