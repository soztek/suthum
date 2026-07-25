import { CheckCircle2 } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { toNumber } from "@/lib/utils";
import { saveSettings } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminSettings({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const s = await getSettings();

  const inputCls = "w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";
  const labelCls = "mb-1.5 block text-sm font-medium text-ink/70";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink">Site Ayarları</h1>

      {ok && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 size={18} /> Ayarlar kaydedildi.
        </div>
      )}

      <form action={saveSettings} className="mt-6 space-y-5">
        <fieldset className="space-y-4 rounded-2xl border border-green-100 bg-white p-6">
          <legend className="px-2 text-sm font-bold text-green-700">İşletme Bilgileri</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>Site Adı</label><input name="siteName" defaultValue={s.siteName} className={inputCls} /></div>
            <div><label className={labelCls}>Slogan</label><input name="tagline" defaultValue={s.tagline} className={inputCls} /></div>
            <div><label className={labelCls}>Telefon</label><input name="phone" defaultValue={s.phone} className={inputCls} /></div>
            <div><label className={labelCls}>WhatsApp (905XXXXXXXXX)</label><input name="whatsapp" defaultValue={s.whatsapp} className={inputCls} /></div>
            <div><label className={labelCls}>E-posta</label><input name="email" defaultValue={s.email} className={inputCls} /></div>
            <div><label className={labelCls}>Instagram (@ olmadan)</label><input name="instagram" defaultValue={s.instagram} className={inputCls} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Adres</label><input name="address" defaultValue={s.address} className={inputCls} /></div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-green-100 bg-white p-6">
          <legend className="px-2 text-sm font-bold text-green-700">Kargo</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>Ücretsiz Kargo Limiti (₺)</label><input name="freeShippingLimit" type="number" step="0.01" defaultValue={toNumber(s.freeShippingLimit)} className={inputCls} /></div>
            <div><label className={labelCls}>Kargo Ücreti (₺)</label><input name="shippingFee" type="number" step="0.01" defaultValue={toNumber(s.shippingFee)} className={inputCls} /></div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-green-100 bg-white p-6">
          <legend className="px-2 text-sm font-bold text-green-700">Anasayfa Metinleri</legend>
          <div><label className={labelCls}>Duyuru Şeridi</label><input name="announcement" defaultValue={s.announcement} className={inputCls} /></div>
          <div><label className={labelCls}>Hero Başlık</label><input name="heroTitle" defaultValue={s.heroTitle} className={inputCls} /></div>
          <div><label className={labelCls}>Hero Alt Başlık</label><textarea name="heroSubtitle" rows={2} defaultValue={s.heroSubtitle} className={inputCls} /></div>
        </fieldset>

        <button className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700">
          Ayarları Kaydet
        </button>
      </form>
    </div>
  );
}
