"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Başarılı ödeme sonrası sepeti temizler.
 * PayTR ödemesi iframe içinde döndüğü için:
 *  - localStorage doğrudan temizlenir → ana pencere "storage" olayıyla senkron olur
 *  - bu bağlamdaki React state de temizlenir
 *  - iframe içindeysek üst pencereye çıkılır (başarı sayfası tam ekran görünsün)
 */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    try {
      localStorage.removeItem("suthum_cart_v1");
    } catch {}
    clear();
    if (typeof window !== "undefined" && window.top && window.top !== window.self) {
      try {
        window.top.location.href = window.location.href;
      } catch {}
    }
  }, [clear]);
  return null;
}
