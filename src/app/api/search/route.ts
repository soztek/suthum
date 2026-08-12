import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 3) return NextResponse.json({ results: [] });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      unit: true,
      imageUrl: true,
      category: { select: { emoji: true, imageUrl: true } },
    },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    take: 8,
  });

  return NextResponse.json({
    results: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: toNumber(p.price),
      unit: p.unit,
      imageUrl: p.imageUrl,
      categoryEmoji: p.category.emoji,
      categoryImage: p.category.imageUrl,
    })),
  });
}
