import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { retrieveCheckout } from "@/lib/iyzico";

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
  const form = await req.formData();
  const token = form.get("token")?.toString();

  if (!token) {
    return NextResponse.redirect(`${base}/odeme/sonuc?status=error`, 303);
  }

  const order = await prisma.order.findFirst({ where: { iyziToken: token } });
  if (!order) {
    return NextResponse.redirect(`${base}/odeme/sonuc?status=error`, 303);
  }

  try {
    const res = await retrieveCheckout(token);
    if (res.paid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", status: "PREPARING", iyziPaymentId: res.paymentId ?? null },
      });
      return NextResponse.redirect(`${base}/odeme/sonuc?status=success&order=${order.orderNo}`, 303);
    }
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
    return NextResponse.redirect(`${base}/odeme/sonuc?status=failed&order=${order.orderNo}`, 303);
  } catch (err) {
    console.error("callback hata:", err);
    return NextResponse.redirect(`${base}/odeme/sonuc?status=error`, 303);
  }
}

// iyzico bazı durumlarda GET ile dönebilir
export async function GET(req: Request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
  return NextResponse.redirect(`${base}/odeme/sonuc?status=error`, 303);
}
