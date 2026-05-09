import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " zł";
}

export function formatPriceCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)).replace(".", ",") + " mln zł";
  }
  if (amount >= 1_000) {
    const val = amount / 1_000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(0)) + " tys. zł";
  }
  return amount + " zł";
}

export function formatRevenue(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " zł / mies.";
}

export function calcROI(price: number, revenue: number): string {
  if (!revenue || revenue === 0) return "—";
  const months = Math.round(price / revenue);
  return `${months} mies.`;
}

export function formatAge(months: number): string {
  if (months < 12) return `${months} mies.`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"}`;
  return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"} ${rem} mies.`;
}
