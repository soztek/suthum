"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/** Başarılı ödeme sonrası sepeti temizler (iyzico yönlendirmesi dönüşü için). */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
