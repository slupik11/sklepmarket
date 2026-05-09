"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Wszystkie",
  "Ebooki",
  "Dropshipping",
  "Kosmetyki",
  "Kursy online",
  "Akcesoria do domu",
  "Moda",
  "Sport",
  "Inne",
];

const PLATFORMS = ["Wszystkie", "Shopify", "WooCommerce", "PrestaShop", "Shoper", "Inne"];

const PRICE_RANGES = [
  { label: "Dowolna", value: "" },
  { label: "do 50 000 zł", value: "0-50000" },
  { label: "50 000 – 150 000 zł", value: "50000-150000" },
  { label: "150 000 – 300 000 zł", value: "150000-300000" },
  { label: "powyżej 300 000 zł", value: "300000-" },
];

const REVENUE_RANGES = [
  { label: "Dowolny", value: "" },
  { label: "do 10 000 zł", value: "0-10000" },
  { label: "10 000 – 30 000 zł", value: "10000-30000" },
  { label: "30 000 – 60 000 zł", value: "30000-60000" },
  { label: "powyżej 60 000 zł", value: "60000-" },
];

const SORT_OPTIONS = [
  { label: "Najnowsze", value: "newest" },
  { label: "Cena: rosnąco", value: "price_asc" },
  { label: "Cena: malejąco", value: "price_desc" },
  { label: "Przychód: malejąco", value: "revenue_desc" },
];

export default function ListingFilters({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname);
  const hasFilters = searchParams.size > 0;

  const SelectField = ({
    label,
    paramKey,
    options,
  }: {
    label: string;
    paramKey: string;
    options: { label: string; value: string }[];
  }) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {label}
      </label>
      <select
        value={searchParams.get(paramKey) || ""}
        onChange={(e) => updateParam(paramKey, e.target.value)}
        className="w-full text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <aside className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-violet" />
          <span className="text-sm font-semibold text-ink">Filtry</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-bg-section hover:text-violet transition-colors"
          >
            <X size={12} />
            Wyczyść
          </button>
        )}
      </div>

      <SelectField
        label="Kategoria"
        paramKey="category"
        options={CATEGORIES.map((c) => ({ label: c, value: c === "Wszystkie" ? "" : c }))}
      />
      <SelectField
        label="Platforma"
        paramKey="platform"
        options={PLATFORMS.map((p) => ({ label: p, value: p === "Wszystkie" ? "" : p }))}
      />
      <SelectField label="Cena sprzedaży" paramKey="price" options={PRICE_RANGES} />
      <SelectField label="Miesięczny przychód" paramKey="revenue" options={REVENUE_RANGES} />
      <SelectField label="Sortowanie" paramKey="sort" options={SORT_OPTIONS} />
    </aside>
  );
}
