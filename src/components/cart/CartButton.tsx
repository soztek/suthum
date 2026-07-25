"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      className="relative flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
      aria-label="Sepeti aç"
    >
      <ShoppingCart size={18} />
      <span className="hidden sm:inline">Sepet</span>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white ring-2 ring-cream">
          {count}
        </span>
      )}
    </button>
  );
}
