import Link from "next/link";
import { Plus, Pencil, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductImage } from "@/components/ProductImage";
import { toggleCampaignActive, deleteCampaign } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { targetProduct: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Kampanyalar <span className="text-base font-medium text-ink/40">({campaigns.length})</span></h1>
        <Link href="/admin/kampanyalar/yeni" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={17} /> Yeni Kampanya
        </Link>
      </div>
      <p className="mt-1 text-sm text-ink/50">
        Kampanyalar sayfasının üstünde afiş olarak gösterilir. Ürün bağlarsan &quot;Sepete Ekle&quot; çıkar.
      </p>

      {campaigns.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-12 text-center text-ink/50">
          Henüz kampanya yok. &quot;Yeni Kampanya&quot; ile ekleyin.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-4">
              <ProductImage src={c.imageUrl} alt={c.title} emoji="🏷️" className="h-16 w-16 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{c.title}</p>
                  {c.priceLabel && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">{c.priceLabel}</span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-ink/50">
                  {c.targetProduct ? (
                    <span className="inline-flex items-center gap-1"><Tag size={12} /> {c.targetProduct.name} → Sepete Ekle</span>
                  ) : c.ctaLink ? (
                    <>Link: {c.ctaLink}</>
                  ) : (
                    "Sadece afiş (buton yok)"
                  )}
                </p>
              </div>
              <form action={toggleCampaignActive}>
                <input type="hidden" name="id" value={c.id} />
                <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/50"}`}>
                  {c.isActive ? "Aktif" : "Pasif"}
                </button>
              </form>
              <div className="flex items-center gap-2">
                <Link href={`/admin/kampanyalar/${c.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-green-200 text-green-700 hover:bg-green-50" title="Düzenle">
                  <Pencil size={15} />
                </Link>
                <DeleteButton action={deleteCampaign} id={c.id} confirmText={`"${c.title}" kampanyası silinsin mi?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
