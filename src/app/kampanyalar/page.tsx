import type { Metadata } from "next";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "SÜT-HÜM kampanyalı ürünleri — indirimli yöresel lezzetler.",
};

export default async function CampaignsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isCampaign: true },
    include: { category: true },
    orderBy: { order: "asc" },
  });

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
            Seçili yöresel ürünlerde özel fiyatlar — stoklarla sınırlı.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {products.length === 0 ? (
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={toProductDTO(p)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
