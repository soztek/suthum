import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { orderByFor } from "@/lib/sort";
import { ProductList } from "@/components/ProductList";
import { SortDropdown } from "@/components/SortDropdown";
import { ViewToggle } from "@/components/ViewToggle";

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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sirala?: string; gorunum?: string }>;
}) {
  const { slug } = await params;
  const { sirala, gorunum } = await searchParams;

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { category: true },
          orderBy: orderByFor(sirala),
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
        {category.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.imageUrl} alt={category.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-white/40" />
        ) : (
          <span className="text-5xl">{category.emoji}</span>
        )}
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
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span>{c.emoji}</span>
                  )}
                  {c.name}
                </span>
                <span className={c.slug === slug ? "text-green-100" : "text-ink/40"}>{c._count.products}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Ürünler */}
        <div>
          {/* Araç çubuğu: görünüm + ürün sayısı + sıralama */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-100 bg-white px-4 py-2.5">
            <div className="flex items-center gap-3">
              <ViewToggle current={gorunum} />
              <span className="text-sm font-medium text-ink/70">{category.products.length} ürün</span>
            </div>
            <SortDropdown current={sirala} />
          </div>

          {category.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
              Bu kategoride henüz ürün yok.
            </div>
          ) : (
            <ProductList products={category.products.map(toProductDTO)} view={gorunum} />
          )}
        </div>
      </div>
    </div>
  );
}
