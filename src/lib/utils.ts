import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const TRY = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

/** Fiyatı ₺ formatında yazar. Decimal/string/number kabul eder. */
export function formatPrice(value: number | string | { toString(): string }): string {
  const n = typeof value === "number" ? value : Number(value.toString());
  return TRY.format(isNaN(n) ? 0 : n);
}

export function toNumber(value: number | string | { toString(): string }): number {
  const n = typeof value === "number" ? value : Number(value.toString());
  return isNaN(n) ? 0 : n;
}

export function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function discountPercent(
  price: number | string,
  compareAt?: number | string | null
): number | null {
  if (!compareAt) return null;
  const p = toNumber(price);
  const c = toNumber(compareAt);
  if (c <= p) return null;
  return Math.round((1 - p / c) * 100);
}

export function orderNo(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SH${y}${(d.getMonth() + 1).toString().padStart(2, "0")}${d
    .getDate()
    .toString()
    .padStart(2, "0")}-${rnd}`;
}
