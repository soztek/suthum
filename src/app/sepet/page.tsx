"use client";

import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="text-6xl">🧺</span>
        <h1 className="text-2xl font-bold text-ink">Sepetiniz boş</h1>
        <p className="text-ink/60">Ardahan'ın doğal lezzetlerini keşfetmeye başlayın.</p>
        <Link href="/" className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700">
          Alışverişe Başla <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-ink">
        <ShoppingBag className="text-green-600" /> Sepetim ({items.length} ürün)
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((l) => (
            <div key={l.productId} className="flex gap-4 rounded-2xl border border-green-100 bg-white p-3">
              <ProductImage src={l.imageUrl} alt={l.name} emoji={l.emoji} className="h-24 w-24 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/urun/${l.slug}`} className="font-semibold text-ink hover:text-green-700">
                      {l.name}
                    </Link>
                    {l.unit && <p className="text-sm text-ink/50">{l.unit}</p>}
                  </div>
                  <button onClick={() => remove(l.productId)} className="text-ink/40 hover:text-orange-600" aria-label="Kaldır">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-green-200">
                    <button onClick={() => setQty(l.productId, l.qty - 1)} className="grid h-9 w-9 place-items-center rounded-l-full text-green-700 hover:bg-green-50">
                      <Minus size={15} />
                    </button>
                    <span className="w-9 text-center font-semibold">{l.qty}</span>
                    <button onClick={() => setQty(l.productId, l.qty + 1)} className="grid h-9 w-9 place-items-center rounded-r-full text-green-700 hover:bg-green-50">
                      <Plus size={15} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{formatPrice(l.price * l.qty)}</p>
                    <p className="text-xs text-ink/50">{formatPrice(l.price)} / adet</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <aside className="h-fit rounded-2xl border border-green-100 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold text-ink">Sipariş Özeti</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Ara Toplam</span>
              <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Kargo</span>
              <span className="text-green-600">Ödeme adımında hesaplanır</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-green-100 pt-4">
            <span className="font-semibold text-ink">Toplam</span>
            <span className="text-2xl font-extrabold text-green-700">{formatPrice(subtotal)}</span>
          </div>
          <Link href="/odeme" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-orange-600">
            Ödemeye Geç <ArrowRight size={18} />
          </Link>
          <Link href="/" className="mt-3 block text-center text-sm text-green-700 hover:underline">
            Alışverişe Devam Et
          </Link>
        </aside>
      </div>
    </div>
  );
}
