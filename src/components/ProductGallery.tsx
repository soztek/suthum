"use client";

import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
  emoji,
  badge,
}: {
  images: string[];
  alt: string;
  emoji?: string | null;
  badge?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? null;

  return (
    <div>
      <div className="relative">
        <ProductImage src={main} alt={alt} emoji={emoji} className="aspect-square rounded-3xl border border-green-100" />
        {badge}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-20",
                active === i ? "border-green-600" : "border-green-100 hover:border-green-300"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
