import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.name ?? "Kategori" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { category: true },
          orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Başlık */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-green-700">Anasayfa</Link>
        <span>/</span>
        <span className="font-medium text-ink">{category.name}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4 rounded-3xl bg-gradient-to-r from-green-600 to-green-700 p-8 text-white">
        <span className="text-5xl">{category.emoji}</span>
        <div>
          <h1 className="text-3xl font-extrabold">{category.name}</h1>
          <p className="mt-1 text-green-50/90">{category.products.length} doğal ürün</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Kategori kenar çubuğu */}
        <aside className="hidden lg:block">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/60">Kategoriler</h3>
          <div className="space-y-1">
            {allCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  c.slug === slug ? "bg-green-600 text-white" : "text-ink hover:bg-green-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{c.emoji}</span> {c.name}
                </span>
                <span className={c.slug === slug ? "text-green-100" : "text-ink/40"}>{c._count.products}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Ürünler */}
        <div>
          {category.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
              Bu kategoride henüz ürün yok.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {category.products.map((p) => (
                <ProductCard key={p.id} product={toProductDTO(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
