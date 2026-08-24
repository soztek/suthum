import type { Prisma } from "@prisma/client";

/** Ürün sıralama seçeneğini Prisma orderBy'a çevirir. */
export function orderByFor(sirala?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sirala) {
    case "fiyat-artan":
      return [{ price: "asc" }];
    case "fiyat-azalan":
      return [{ price: "desc" }];
    case "isim":
      return [{ name: "asc" }];
    case "yeni":
      return [{ createdAt: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { order: "asc" }];
  }
}
