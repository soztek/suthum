import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";

export const metadata: Metadata = { title: "Arama" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();

  const products = term
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { category: { name: { contains: term, mode: "insensitive" } } },
          ],
        },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
        take: 48,
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-green-700">Anasayfa</Link>
        <span>/</span>
        <span className="font-medium text-ink">Arama</span>
      </nav>

      <div className="mx-auto mb-8 max-w-xl">
        <SearchBar />
      </div>

      {!term ? (
        <p className="text-center text-ink/50">Aramak istediğin ürünü yaz.</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center">
          <Search size={32} className="mx-auto text-green-300" />
          <p className="mt-3 font-semibold text-ink">“{term}” için sonuç bulunamadı.</p>
          <p className="mt-1 text-sm text-ink/50">Farklı bir kelime deneyin (ör. kaşar, bal, tereyağı).</p>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-ink/60">
            <b className="text-ink">“{term}”</b> için {products.length} ürün bulundu
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={toProductDTO(p)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
