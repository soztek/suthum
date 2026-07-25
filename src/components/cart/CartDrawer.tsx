"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "./CartProvider";
import { ProductImage } from "../ProductImage";
import { formatPrice } from "@/lib/utils";

export function CartDrawer({ freeShippingLimit }: { freeShippingLimit: number }) {
  const { items, subtotal, setQty, remove, isOpen, close } = useCart();

  const remaining = Math.max(0, freeShippingLimit - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingLimit) * 100);

  return (
    <>
      {/* Karartma */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-green-100 bg-white px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <ShoppingBag size={20} className="text-green-600" /> Sepetim
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm text-green-700">
              {items.length}
            </span>
          </h2>
          <button onClick={close} className="rounded-full p-2 text-ink/60 hover:bg-green-50" aria-label="Kapat">
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-5xl">🧺</span>
            <p className="text-ink/60">Sepetiniz henüz boş.</p>
            <button onClick={close} className="mt-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              Alışverişe Başla
            </button>
          </div>
        ) : (
          <>
            {/* Ücretsiz kargo ilerlemesi */}
            <div className="border-b border-green-100 bg-white px-5 py-3">
              <p className="flex items-center gap-1.5 text-xs text-ink/70">
                <Truck size={14} className="text-orange-500" />
                {remaining > 0 ? (
                  <>
                    Ücretsiz kargoya <b className="text-green-700">{formatPrice(remaining)}</b> kaldı
                  </>
                ) : (
                  <b className="text-green-700">Ücretsiz kargo kazandınız! 🎉</b>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-green-100">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-orange-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((l) => (
                <div key={l.productId} className="flex gap-3 rounded-xl border border-green-100 bg-white p-2.5">
                  <ProductImage src={l.imageUrl} alt={l.name} emoji={l.emoji} className="h-16 w-16 shrink-0 rounded-lg" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold text-ink">{l.name}</p>
                      <button onClick={() => remove(l.productId)} className="text-ink/40 hover:text-orange-600" aria-label="Kaldır">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {l.unit && <span className="text-xs text-ink/50">{l.unit}</span>}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center rounded-full border border-green-200">
                        <button onClick={() => setQty(l.productId, l.qty - 1)} className="grid h-7 w-7 place-items-center text-green-700 hover:bg-green-50 rounded-l-full">
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                        <button onClick={() => setQty(l.productId, l.qty + 1)} className="grid h-7 w-7 place-items-center text-green-700 hover:bg-green-50 rounded-r-full">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-green-700">{formatPrice(l.price * l.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-green-100 bg-white px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-base">
                <span className="text-ink/70">Ara Toplam</span>
                <span className="text-xl font-bold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/odeme"
                onClick={close}
                className="block rounded-full bg-orange-500 px-6 py-3.5 text-center text-base font-semibold text-white shadow-lg transition hover:bg-orange-600"
              >
                Ödemeye Geç
              </Link>
              <Link href="/sepet" onClick={close} className="mt-2 block text-center text-sm text-green-700 hover:underline">
                Sepeti Görüntüle
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
