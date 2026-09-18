import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveCampaign } from "@/lib/admin-actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const dynamic = "force-dynamic";

export default async function CampaignForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "yeni";

  const [campaign, products] = await Promise.all([
    isNew ? null : prisma.campaign.findUnique({ where: { id } }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!isNew && !campaign) notFound();

  const inputCls =
    "w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";
  const labelCls = "mb-1.5 block text-sm font-medium text-ink/70";

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/kampanyalar" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline">
        <ArrowLeft size={16} /> Kampanyalara Dön
      </Link>
      <h1 className="text-2xl font-extrabold text-ink">{isNew ? "Yeni Kampanya" : "Kampanyayı Düzenle"}</h1>

      <form action={saveCampaign} className="mt-6 space-y-5">
        {!isNew && <input type="hidden" name="id" value={campaign!.id} />}

        <div className="rounded-2xl border border-green-100 bg-white p-6">
          <ImageUpload name="imageUrl" defaultValue={campaign?.imageUrl ?? ""} label="Kampanya Görseli" />
        </div>

        <div className="space-y-4 rounded-2xl border border-green-100 bg-white p-6">
          <div>
            <label className={labelCls}>Başlık *</label>
            <input name="title" required defaultValue={campaign?.title ?? ""} className={inputCls} placeholder="Örn: Kaşar + Bal Paketi" />
          </div>
          <div>
            <label className={labelCls}>Açıklama</label>
            <textarea name="description" rows={3} defaultValue={campaign?.description ?? ""} className={inputCls} placeholder="Örn: 1 kg eski kaşar + 500 gr kara kovan balı bir arada." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Fiyat / Etiket</label>
              <input name="priceLabel" defaultValue={campaign?.priceLabel ?? ""} className={inputCls} placeholder="Örn: ₺599  ·  %20 İndirim  ·  2 AL 1 ÖDE" />
            </div>
            <div>
              <label className={labelCls}>Sıra (küçük = önce)</label>
              <input name="order" type="number" defaultValue={campaign?.order ?? 0} className={inputCls} />
            </div>
          </div>

          <div className="rounded-xl bg-green-50/60 p-4">
            <label className={labelCls}>Bağlı Ürün (Sepete Ekle için)</label>
            <select name="targetProductId" defaultValue={campaign?.targetProductId ?? ""} className={inputCls}>
              <option value="">— Yok (buton için aşağıya link yaz) —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-ink/50">
              Ürün seçersen kartta <b>&quot;Sepete Ekle&quot;</b> çıkar ve o ürün gerçek fiyatıyla sepete eklenir.
              Ürün seçmezsen aşağıdaki linke giden <b>&quot;İncele&quot;</b> butonu görünür.
            </p>
            <div className="mt-3">
              <label className={labelCls}>Buton Linki (ürün seçmediysen)</label>
              <input name="ctaLink" defaultValue={campaign?.ctaLink ?? ""} className={inputCls} placeholder="Örn: /kategori/paketler" />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 text-sm font-medium text-ink/80">
            <input type="checkbox" name="isActive" defaultChecked={campaign?.isActive ?? true} className="h-4 w-4 accent-green-600" /> Aktif (sitede görünür)
          </label>
        </div>

        <div className="flex gap-3">
          <button className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700">
            {isNew ? "Kampanyayı Oluştur" : "Değişiklikleri Kaydet"}
          </button>
          <Link href="/admin/kampanyalar" className="rounded-full border border-green-200 px-8 py-3 font-semibold text-green-700 hover:bg-green-50">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
