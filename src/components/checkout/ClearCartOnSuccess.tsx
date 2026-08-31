"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Başarılı ödeme sonrası sepeti temizler.
 * PayTR ödemesi iframe içinde döndüğü için, sayfa iframe içindeyse önce
 * üst pencereye çıkar (ana uygulama bağlamında sepet temizlensin + tam ekran görünsün).
 */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    if (typeof window !== "undefined" && window.top && window.top !== window.self) {
      // iframe içindeyiz → üst pencereyi bu sayfaya taşı, sepet orada temizlenir
      window.top.location.href = window.location.href;
      return;
    }
    clear();
  }, [clear]);
  return null;
}
