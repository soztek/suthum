import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

/**
 * Menüde (Header + MobileNav) gösterilen aktif kategoriler.
 * Her sayfa isteğinde çağrıldığı için önbelleklenir.
 * Kategori değişince admin-actions revalidateTag("categories") ile yeniler.
 */
export const getNavCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true, emoji: true, imageUrl: true },
    });
  },
  ["nav-categories"],
  { tags: ["categories"], revalidate: 300 }
);
