"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Ürün görseli. imageUrl yoksa (ya da yüklenemezse) degrade + emoji yer tutucu gösterir. */
export function ProductImage({
  src,
  alt,
  emoji,
  className,
}: {
  src?: string | null;
  alt: string;
  emoji?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-green-50", className)}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 via-cream to-orange-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={alt} className="max-h-[85%] max-w-[85%] object-contain opacity-95" />
          {emoji && (
            <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-lg shadow-sm">
              {emoji}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
