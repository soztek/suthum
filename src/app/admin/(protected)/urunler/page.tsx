import Link from "next/link";
import { Plus, Pencil, Star, Snowflake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { toggleProductActive, deleteProduct } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Ürünler <span className="text-base font-medium text-ink/40">({products.length})</span></h1>
        <Link href="/admin/urunler/yeni" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={17} /> Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-green-100 bg-white">
        <div className="hidden grid-cols-[1fr_140px_120px_120px_160px] gap-3 border-b border-green-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50 md:grid">
          <span>Ürün</span><span>Kategori</span><span>Fiyat</span><span>Durum</span><span className="text-right">İşlem</span>
        </div>
        <div className="divide-y divide-green-50">
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-1 items-center gap-3 px-5 py-3 md:grid-cols-[1fr_140px_120px_120px_160px]">
              <div className="flex items-center gap-3">
                <ProductImage src={p.imageUrl} alt={p.name} emoji={p.category.emoji} className="h-12 w-12 shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{p.name}</p>
                  <p className="flex items-center gap-2 text-xs text-ink/50">
                    {p.unit} {p.isFeatured && <Star size={11} className="fill-orange-400 text-orange-400" />}
                    {p.coldChain && <Snowflake size={11} className="text-green-500" />}
                  </p>
                </div>
              </div>
              <span className="text-sm text-ink/70">{p.category.emoji} {p.category.name}</span>
              <span className="text-sm font-bold text-green-700">{formatPrice(p.price)}</span>
              <form action={toggleProductActive}>
                <input type="hidden" name="id" value={p.id} />
                <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.isActive ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/50"}`}>
                  {p.isActive ? "Aktif" : "Pasif"}
                </button>
              </form>
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/urunler/${p.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-green-200 text-green-700 hover:bg-green-50">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteProduct} id={p.id} confirmText={`"${p.name}" silinsin mi?`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
