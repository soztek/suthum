"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Truck, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm({
  freeShippingLimit,
  shippingFee,
  paymentLive,
  initial,
}: {
  freeShippingLimit: number;
  shippingFee: number;
  paymentLive: boolean;
  initial?: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
  };
}) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "",
    district: "",
    address: initial?.address ?? "",
    note: "",
  });

  const shipping = subtotal >= freeShippingLimit ? 0 : shippingFee;
  const total = subtotal + shipping;

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        setLoading(false);
        return;
      }
      if (data.mode === "iyzico" && data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
        return;
      }
      // demo mod
      clear();
      router.push(`/odeme/sonuc?status=success&order=${data.orderNo}`);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center">
        <p className="text-ink/60">Sepetiniz boş.</p>
        <Link href="/" className="mt-3 inline-block rounded-full bg-green-600 px-6 py-2.5 font-semibold text-white hover:bg-green-700">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Teslimat bilgileri */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-green-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">Teslimat Bilgileri</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Ad Soyad *</label>
              <input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputCls} placeholder="Adınız Soyadınız" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">E-posta *</label>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="ornek@mail.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Telefon *</label>
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">İl *</label>
              <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} placeholder="İstanbul" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">İlçe</label>
              <input value={form.district} onChange={(e) => update("district", e.target.value)} className={inputCls} placeholder="Kadıköy" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Açık Adres *</label>
              <textarea required value={form.address} onChange={(e) => update("address", e.target.value)} rows={3} className={inputCls} placeholder="Mahalle, cadde, sokak, bina/daire no" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Sipariş Notu</label>
              <textarea value={form.note} onChange={(e) => update("note", e.target.value)} rows={2} className={inputCls} placeholder="Eklemek istedikleriniz (opsiyonel)" />
            </div>
          </div>
        </div>

        {!paymentLive && (
          <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p>
              <b>Test / Demo modu:</b> iyzico anahtarları henüz tanımlı değil. Siparişi onayladığınızda kart bilgisi
              istenmeden sipariş oluşturulur. Gerçek ödeme için panelden iyzico anahtarlarını ekleyin.
            </p>
          </div>
        )}
      </div>

      {/* Özet */}
      <aside className="h-fit rounded-2xl border border-green-100 bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold text-ink">Siparişiniz</h2>
        <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
          {items.map((l) => (
            <div key={l.productId} className="flex items-center gap-3">
              <div className="relative">
                <ProductImage src={l.imageUrl} alt={l.name} emoji={l.emoji} className="h-12 w-12 rounded-lg" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-green-600 px-1 text-xs font-bold text-white">
                  {l.qty}
                </span>
              </div>
              <p className="line-clamp-1 flex-1 text-sm text-ink">{l.name}</p>
              <span className="text-sm font-semibold text-ink">{formatPrice(l.price * l.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-green-100 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Ara Toplam</span>
            <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span className="flex items-center gap-1"><Truck size={14} /> Kargo</span>
            <span className={shipping === 0 ? "font-semibold text-green-600" : "font-semibold text-ink"}>
              {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-green-100 pt-3">
          <span className="font-semibold text-ink">Toplam</span>
          <span className="text-2xl font-extrabold text-green-700">{formatPrice(total)}</span>
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
            <AlertCircle size={16} /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Lock size={18} />}
          {loading ? "İşleniyor..." : paymentLive ? "Güvenli Ödemeye Geç" : "Siparişi Tamamla"}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/50">
          <Lock size={12} /> 256-bit SSL ile güvenli ödeme
        </p>
      </aside>
    </form>
  );
}
