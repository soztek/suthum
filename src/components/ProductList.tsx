import { ProductCard } from "./ProductCard";
import { ProductRow } from "./ProductRow";
import type { ProductDTO } from "@/lib/types";

export function ProductList({
  products,
  view,
}: {
  products: ProductDTO[];
  view?: string;
}) {
  if (view === "liste") {
    return (
      <div className="space-y-3">
        {products.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
