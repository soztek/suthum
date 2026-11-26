import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { orderNo, toNumber } from "@/lib/utils";
import { isPaytrLive, getPaytrToken } from "@/lib/paytr";
import { getCurrentUser, hashPassword, createUserSession } from "@/lib/user-auth";
import { sendOrderEmails } from "@/lib/email";

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
  paymentMethod: z.enum(["card", "havale"]).optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
  invoice: z
    .object({
      type: z.enum(["bireysel", "kurumsal"]),
      tckn: z.string().optional(),
      companyName: z.string().optional(),
      taxOffice: z.string().optional(),
      taxNo: z.string().optional(),
      sameAsDelivery: z.boolean().optional(),
      address: z.string().optional(),
    })
    .optional(),
});

/** Fatura bilgilerini doğrular; hata varsa mesaj döner, yoksa null. */
function validateInvoice(inv: {
  type: "bireysel" | "kurumsal";
  tckn?: string;
  companyName?: string;
  taxOffice?: string;
  taxNo?: string;
  sameAsDelivery?: boolean;
  address?: string;
}): string | null {
  if (inv.type === "bireysel") {
    if (!/^\d{11}$/.test((inv.tckn ?? "").trim())) {
      return "Fatura için geçerli bir TC Kimlik No girin (11 hane).";
    }
  } else {
    if (!(inv.companyName ?? "").trim()) return "Firma ünvanı gerekli.";
    if (!(inv.taxOffice ?? "").trim()) return "Vergi dairesi gerekli.";
    if (!/^\d{10,11}$/.test((inv.taxNo ?? "").trim())) {
      return "Geçerli bir vergi no girin (10 hane).";
    }
  }
  if (inv.sameAsDelivery === false && (inv.address ?? "").trim().length < 10) {
    return "Fatura adresi gerekli.";
  }
  return null;
}

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
  const payMethod = parsed.data.paymentMethod ?? "card";

  // Fatura bilgileri (ticari fatura için zorunlu)
  const invoice = parsed.data.invoice;
  if (!invoice) {
    return NextResponse.json({ error: "Fatura bilgileri gerekli." }, { status: 400 });
  }
  const invoiceError = validateInvoice(invoice);
  if (invoiceError) {
    return NextResponse.json({ error: invoiceError }, { status: 400 });
  }
  const invoiceData = {
    invoiceType: invoice.type,
    tckn: invoice.type === "bireysel" ? invoice.tckn?.trim() || null : null,
    companyName: invoice.type === "kurumsal" ? invoice.companyName?.trim() || null : null,
    taxOffice: invoice.type === "kurumsal" ? invoice.taxOffice?.trim() || null : null,
    taxNo: invoice.type === "kurumsal" ? invoice.taxNo?.trim() || null : null,
    invoiceAddress:
      invoice.sameAsDelivery === false ? invoice.address?.trim() || null : null,
  };

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

  // Misafir isterse siparişle birlikte üyelik oluştur
  let userId = currentUser?.id ?? null;
  let accountCreated = false;
  if (!currentUser && parsed.data.createAccount) {
    const pw = parsed.data.password ?? "";
    if (pw.length < 6) {
      return NextResponse.json(
        { error: "Üyelik için en az 6 karakterli bir şifre girin." },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({ where: { email: customer.email } });
    if (!existing) {
      const newUser = await prisma.user.create({
        data: {
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          city: customer.city,
          address: customer.address,
          passwordHash: await hashPassword(pw),
        },
      });
      await createUserSession(newUser.id);
      userId = newUser.id;
      accountCreated = true;
    }
    // E-posta zaten kayıtlıysa hesap oluşturulmaz; sipariş misafir olarak devam eder.
  }

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
      userId,
      paymentMethod: payMethod,
      ...invoiceData,
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

  // --- HAVALE / EFT: kart çekilmez, sipariş "ödeme bekliyor" olarak oluşur ---
  if (payMethod === "havale") {
    await sendOrderEmails(order.id);
    return NextResponse.json({ mode: "havale", orderNo: order.orderNo, accountCreated });
  }

  // --- DEMO MOD: PayTR anahtarı yoksa ödeme simüle edilir ---
  if (!isPaytrLive()) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "PREPARING" },
    });
    await sendOrderEmails(order.id);
    return NextResponse.json({ mode: "demo", orderNo: order.orderNo, accountCreated });
  }

  // --- GERÇEK ÖDEME: PayTR iFrame ---
  // Adresi güvenli belirle: env yalnızca geçerli https ise kullan, aksi halde istek host'undan al.
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  const hostHdr = req.headers.get("host");
  const base =
    envBase && envBase.startsWith("https://")
      ? envBase.replace(/\/$/, "")
      : hostHdr
        ? `https://${hostHdr}`
        : new URL(req.url).origin;
  const xff = req.headers.get("x-forwarded-for");
  const ip = (xff ? xff.split(",")[0].trim() : "") || "85.34.78.112";
  // PayTR merchant_oid yalnız harf+rakam olmalı; sipariş no'dan üretilir ve orderda saklanır.
  const merchantOid = order.orderNo.replace(/[^a-zA-Z0-9]/g, "");

  await prisma.order.update({ where: { id: order.id }, data: { iyziToken: merchantOid } });

  const result = await getPaytrToken({
    merchantOid,
    email: customer.email,
    amount: total,
    userName: customer.fullName,
    userAddress: `${customer.address} ${customer.district ?? ""} ${customer.city}`.trim(),
    userPhone: customer.phone,
    userIp: ip,
    basket: lines.map((l) => [l.product.name, l.unitPrice.toFixed(2), l.qty]),
    okUrl: `${base}/odeme/sonuc?status=success&order=${order.orderNo}`,
    failUrl: `${base}/odeme/sonuc?status=failed&order=${order.orderNo}`,
  });

  if (!result.ok) {
    console.error("PayTR token hatası:", result.error);
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    return NextResponse.json({ error: result.error || "Ödeme başlatılamadı." }, { status: 502 });
  }

  return NextResponse.json({ mode: "paytr", token: result.token, accountCreated });
}
