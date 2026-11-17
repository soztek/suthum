import { unstable_cache } from "next/cache";

/**
 * Vitrin (katalog) sorguları için ortak önbellek.
 *
 * Neden: Site her istekte DB'ye gidiyordu; botlar (özellikle Meta) ana sayfaya
 * saniyeler içinde tekrar tekrar geldiği için Neon veritabanı hiç uykuya
 * geçemiyor ve compute faturası şişiyordu. Katalog verisi yalnızca admin
 * panelinden değişir; bu yüzden uzun süre önbellekte tutulur ve admin
 * değişikliklerinde `updateTag(CATALOG_TAG)` ile anında yenilenir.
 *
 * Not: Önbellekten dönen veri JSON'dan geçer — Decimal alanlar string,
 * DateTime alanlar ISO string olarak gelir (toNumber / new Date ile kullan).
 */
export const CATALOG_TAG = "catalog";
export const CATALOG_TTL = 60 * 60 * 6; // 6 saat

export function cachedCatalog<T>(key: (string | number | undefined | null)[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, ["catalog", ...key.map((k) => String(k ?? ""))], {
    tags: [CATALOG_TAG],
    revalidate: CATALOG_TTL,
  })();
}
