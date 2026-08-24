import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { orderByFor } from "@/lib/sort";
import { ProductList } from "@/components/ProductList";
import { SortDropdown } from "@/components/SortDropdown";
import { ViewToggle } from "@/components/ViewToggle";
import { CategoryFilter } from "@/components/CategoryFilter";

export const metadata: Metadata = { title: "Tüm Ürünler" };
export const dynamic = "force-dynamic";

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sirala?: string; gorunum?: string; kategori?: string }>;
}) {
  const { sirala, gorunum, kategori } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.product.findMany({
      where: { isActive: true, ...(kategori ? { category: { slug: kategori } } : {}) },
      include: { category: true },
      orderBy: orderByFor(sirala),
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-4 flex items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-green-700">Anasayfa</Link>
        <span>/</span>
        <span className="font-medium text-ink">Tüm Ürünler</span>
      </nav>

      <h1 className="mb-5 text-2xl font-extrabold text-ink sm:text-3xl">Tüm Ürünler</h1>

      {/* Araç çubuğu */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-100 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <ViewToggle current={gorunum} />
          <span className="hidden text-sm font-medium text-ink/70 sm:inline">{products.length} ürün</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryFilter categories={categories} current={kategori} />
          <SortDropdown current={sirala} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
          Bu filtreyle ürün bulunamadı.
        </div>
      ) : (
        <ProductList products={products.map(toProductDTO)} view={gorunum} />
      )}
    </div>
  );
}
