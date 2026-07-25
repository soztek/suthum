"use client";

import { useState } from "react";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCart } from "./CartProvider";
import type { ProductDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  variant = "card",
}: {
  product: ProductDTO;
  variant?: "card" | "detail";
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    add(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        unit: product.unit,
        price: product.price,
        imageUrl: product.imageUrl,
        emoji: product.categoryEmoji,
      },
      variant === "detail" ? qty : 1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  if (variant === "detail") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center rounded-full border border-green-200 bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center text-green-700 hover:bg-green-50 rounded-l-full"
            aria-label="Azalt"
          >
            <Minus size={18} />
          </button>
          <span className="w-10 text-center text-lg font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="grid h-12 w-12 place-items-center text-green-700 hover:bg-green-50 rounded-r-full"
            aria-label="Artır"
          >
            <Plus size={18} />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all",
            added ? "bg-green-600" : "bg-orange-500 hover:bg-orange-600 hover:shadow-orange-500/30"
          )}
        >
          {added ? <Check size={20} /> : <ShoppingCart size={20} />}
          {added ? "Sepete Eklendi" : "Sepete Ekle"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
        added
          ? "bg-green-600 text-white"
          : "bg-green-50 text-green-700 hover:bg-orange-500 hover:text-white"
      )}
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {added ? "Eklendi" : "Sepete Ekle"}
    </button>
  );
}
