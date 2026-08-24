import Link from "next/link";
import { Star, Snowflake } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./cart/AddToCartButton";
import type { ProductDTO } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/utils";

export function ProductRow({ product }: { product: ProductDTO }) {
  const discount = discountPercent(product.price, product.compareAt);

  return (
    <div className="flex gap-3 rounded-2xl border border-green-100 bg-white p-3 card-shadow sm:gap-4">
      <Link href={`/urun/${product.slug}`} className="relative shrink-0">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          emoji={product.categoryEmoji}
          className="h-24 w-24 rounded-xl sm:h-32 sm:w-32"
        />
        {discount && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow">
            %{discount}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        {product.categoryName && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-500">{product.categoryName}</span>
        )}
        <Link href={`/urun/${product.slug}`}>
          <h3 className="line-clamp-1 font-semibold text-ink hover:text-green-700 sm:text-lg">{product.name}</h3>
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/60">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-orange-400 text-orange-400" /> {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
          {product.unit && <span>{product.unit}</span>}
          {product.coldChain && (
            <span className="flex items-center gap-1 text-green-600"><Snowflake size={11} /> Soğuk Zincir</span>
          )}
        </div>
        {product.description && (
          <p className="mt-1 hidden line-clamp-2 text-sm text-ink/60 sm:block">{product.description}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-700">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-ink/40 line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
          <div className="w-36 sm:w-44">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
