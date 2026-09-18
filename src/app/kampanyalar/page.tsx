import type { Metadata } from "next";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "SÜT-HÜM kampanyalı ürünleri ve özel fırsatlar — indirimli yöresel lezzetler.",
};

export default async function CampaignsPage() {
  const [banners, products] = await Promise.all([
    prisma.campaign.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { targetProduct: { include: { category: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, isCampaign: true },
      include: { category: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const hasContent = banners.length > 0 || products.length > 0;

  return (
    <div>
      {/* Başlık */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-14 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25">
            <Tag size={15} /> Fırsatlar
          </span>
          <h1 className="mt-3 text-4xl font-extrabold">Kampanyalar</h1>
          <p className="mt-3 text-lg text-orange-50/90">
            Seçili yöresel ürünlerde özel fiyatlar ve fırsatlar — stoklarla sınırlı.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {!hasContent ? (
          <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/40 p-14 text-center">
            <Tag size={40} className="mx-auto text-orange-400" />
            <h2 className="mt-4 text-xl font-bold text-ink">Şu an aktif kampanya yok</h2>
            <p className="mt-2 text-ink/60">Yakında burada olacağız. Ürünlerimize göz atabilirsiniz.</p>
            <Link
              href="/urunler"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700"
            >
              Tüm Ürünler <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Serbest kampanya afişleri */}
            {banners.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {banners.map((c) => (
                  <div key={c.id} className="flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white card-shadow sm:flex-row">
                    <div className="relative sm:w-2/5">
                      <ProductImage
                        src={c.imageUrl}
                        alt={c.title}
                        emoji="🏷️"
                        className="h-48 w-full sm:h-full"
                      />
                      {c.priceLabel && (
                        <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-sm font-extrabold text-white shadow">
                          {c.priceLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-extrabold text-ink">{c.title}</h3>
                      {c.description && <p className="mt-1.5 flex-1 text-sm text-ink/60">{c.description}</p>}
                      <div className="mt-4">
                        {c.targetProduct ? (
                          <AddToCartButton product={toProductDTO(c.targetProduct)} />
                        ) : c.ctaLink ? (
                          <Link
                            href={c.ctaLink}
                            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                          >
                            İncele <ArrowRight size={16} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Kampanyalı ürünler */}
            {products.length > 0 && (
              <div className={banners.length > 0 ? "mt-12" : ""}>
                {banners.length > 0 && (
                  <h2 className="mb-6 text-xl font-extrabold text-ink">Kampanyalı Ürünler</h2>
                )}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={toProductDTO(p)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
