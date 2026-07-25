/** Client'a gönderilecek sadeleştirilmiş ürün tipi (Decimal -> number). */
export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAt?: number | null;
  unit?: string | null;
  imageUrl?: string | null;
  images: string[];
  stock: number;
  coldChain: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  categoryName?: string;
  categoryEmoji?: string | null;
  categorySlug?: string;
}
