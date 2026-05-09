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
