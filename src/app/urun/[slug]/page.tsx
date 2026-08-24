import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Snowflake, Truck, ShieldCheck, Leaf } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPrice, discountPercent } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return {
    title: product?.name ?? "Ürün",
    description: product?.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) notFound();

  const dto = toProductDTO(product);
  const discount = discountPercent(dto.price, dto.compareAt);

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-green-700">Anasayfa</Link>
        <span>/</span>
        <Link href={`/kategori/${product.category.slug}`} className="hover:text-green-700">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Görsel galerisi */}
        <div>
          <ProductGallery
            images={[dto.imageUrl, ...dto.images].filter(
              (v, i, a): v is string => Boolean(v) && a.indexOf(v) === i
            )}
            alt={dto.name}
            emoji={dto.categoryEmoji}
            badge={
              discount ? (
                <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-bold text-white shadow">
                  %{discount} İndirim
                </span>
              ) : null
            }
          />
        </div>

        {/* Bilgi */}
        <div>
          <Link href={`/kategori/${product.category.slug}`} className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            {product.category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(dto.rating) ? "fill-orange-400 text-orange-400" : "text-green-200"} />
              ))}
            </div>
            <span className="font-semibold text-ink/80">{dto.rating.toFixed(1)}</span>
            <span className="text-ink/50">({dto.reviewCount} değerlendirme)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-green-700">{formatPrice(dto.price)}</span>
            {dto.compareAt && (
              <span className="text-xl text-ink/40 line-through">{formatPrice(dto.compareAt)}</span>
            )}
            {dto.unit && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{dto.unit}</span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 leading-relaxed text-ink/70">{product.description}</p>
          )}

          <div className="mt-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                ● Stokta var
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                ● Geçici olarak tükendi
              </span>
            )}
          </div>

          <div className="mt-6">
            <AddToCartButton product={dto} variant="detail" />
          </div>

          {/* Güven rozetleri */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { i: Snowflake, t: "Soğuk Zincir" },
              { i: Truck, t: "Hızlı Kargo" },
              { i: Leaf, t: "Katkısız" },
              { i: ShieldCheck, t: "Güvenli Ödeme" },
            ].map((b, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 rounded-xl border border-green-100 bg-white p-3 text-center">
                <b.i size={20} className="text-green-600" />
                <span className="text-xs font-medium text-ink/70">{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-ink">Benzer Ürünler</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={toProductDTO(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
