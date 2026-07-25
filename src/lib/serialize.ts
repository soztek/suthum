import type { Product, Category } from "@prisma/client";
import type { ProductDTO } from "./types";
import { toNumber } from "./utils";

type ProductWithCategory = Product & { category?: Category | null };

export function toProductDTO(p: ProductWithCategory): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: toNumber(p.price),
    compareAt: p.compareAt ? toNumber(p.compareAt) : null,
    unit: p.unit,
    imageUrl: p.imageUrl,
    images: p.images ?? [],
    stock: p.stock,
    coldChain: p.coldChain,
    isFeatured: p.isFeatured,
    rating: p.rating,
    reviewCount: p.reviewCount,
    categoryName: p.category?.name,
    categoryEmoji: p.category?.emoji,
    categorySlug: p.category?.slug,
  };
}
