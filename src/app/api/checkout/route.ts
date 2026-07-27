import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { orderNo, toNumber } from "@/lib/utils";
import { isPaymentLive, initCheckoutForm } from "@/lib/iyzico";
import { getCurrentUser } from "@/lib/user-auth";

const schema = z.object({
  customer: z.object({
    fullName: z.string().min(2, "Ad soyad gerekli"),
    email: z.string().email("Geçerli e-posta girin"),
    phone: z.string().min(10, "Geçerli telefon girin"),
    address: z.string().min(10, "Adres gerekli"),
    city: z.string().min(2, "İl gerekli"),
    district: z.string().optional(),
    note: z.string().optional(),
  }),
  items: z
    .array(z.object({ productId: z.string(), qty: z.number().int().positive() }))
    .min(1, "Sepet boş"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Form hatalı" },
      { status: 400 }
    );
  }
  const { customer, items } = parsed.data;

  // Ürünleri veritabanından oku — fiyatlara SUNUCUDA karar verilir.
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
    include: { category: true },
  });

  const lines = items
    .map((i) => {
      const p = products.find((pp) => pp.id === i.productId);
      if (!p) return null;
      const unitPrice = toNumber(p.price);
      return {
        product: p,
        qty: i.qty,
        unitPrice,
        lineTotal: unitPrice * i.qty,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (lines.length === 0) {
    return NextResponse.json({ error: "Sepetteki ürünler bulunamadı" }, { status: 400 });
  }

  const currentUser = await getCurrentUser();
  const settings = await getSettings();
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const freeLimit = toNumber(settings.freeShippingLimit);
  const shipping = subtotal >= freeLimit ? 0 : toNumber(settings.shippingFee);
  const total = subtotal + shipping;

  // Siparişi oluştur
  const order = await prisma.order.create({
    data: {
      orderNo: orderNo(),
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      district: customer.district || null,
      note: customer.note || null,
      userId: currentUser?.id ?? null,
      subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
      shipping: new Prisma.Decimal(shipping.toFixed(2)),
      total: new Prisma.Decimal(total.toFixed(2)),
      items: {
        create: lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          unit: l.product.unit,
          unitPrice: new Prisma.Decimal(l.unitPrice.toFixed(2)),
          quantity: l.qty,
          lineTotal: new Prisma.Decimal(l.lineTotal.toFixed(2)),
        })),
      },
    },
  });

  // --- DEMO MOD: iyzico anahtarı yoksa ödeme simüle edilir ---
  if (!isPaymentLive()) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "PREPARING" },
    });
    return NextResponse.json({ mode: "demo", orderNo: order.orderNo });
  }

  // --- GERÇEK ÖDEME: iyzico Checkout Form ---
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const xff = req.headers.get("x-forwarded-for");
    const ip = (xff ? xff.split(",")[0].trim() : "") || "85.34.78.112";

    const result = await initCheckoutForm({
      conversationId: order.id,
      basketId: order.orderNo,
      price: subtotal.toFixed(2),
      paidPrice: total.toFixed(2),
      callbackUrl: `${base}/api/payment/callback`,
      buyer: {
        id: order.id,
        name: customer.fullName,
        surname: "",
        email: customer.email,
        phone: customer.phone,
        address: `${customer.address} ${customer.district ?? ""} ${customer.city}`.trim(),
        city: customer.city,
        ip,
      },
      items: lines.map((l) => ({
        id: l.product.id,
        name: l.product.name,
        category: l.product.category.name,
        price: l.lineTotal.toFixed(2),
      })),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { iyziToken: result.token },
    });

    return NextResponse.json({ mode: "iyzico", paymentPageUrl: result.paymentPageUrl });
  } catch (err) {
    console.error("iyzico hata:", err);
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
    return NextResponse.json(
      { error: "Ödeme başlatılamadı. Lütfen tekrar deneyin." },
      { status: 502 }
    );
  }
}
