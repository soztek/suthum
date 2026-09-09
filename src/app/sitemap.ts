import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://suthum.com";

// Site DB'den beslendiği için sitemap istek anında üretilir (build'de DB'ye gidilmez).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statik / sabit sayfalar
  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "daily" },
    { path: "/urunler", priority: 0.9, freq: "daily" },
    { path: "/hakkimizda", priority: 0.6, freq: "monthly" },
    { path: "/iletisim", priority: 0.6, freq: "monthly" },
    { path: "/mesafeli-satis", priority: 0.3, freq: "yearly" },
    { path: "/iade", priority: 0.3, freq: "yearly" },
    { path: "/teslimat", priority: 0.3, freq: "yearly" },
    { path: "/gizlilik", priority: 0.3, freq: "yearly" },
  ];

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${BASE}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/kategori/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/urun/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
