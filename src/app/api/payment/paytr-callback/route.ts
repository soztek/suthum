import { prisma } from "@/lib/prisma";
import { verifyPaytrCallback } from "@/lib/paytr";
import { sendOrderEmails } from "@/lib/email";

// PayTR sunucudan sunucuya bu adrese POST atar (Bildirim URL).
// Yanıt gövdesi MUTLAKA "OK" olmalı; aksi halde PayTR tekrar dener.
export async function POST(req: Request) {
  const form = await req.formData();
  const post: Record<string, string> = {};
  for (const [k, v] of form.entries()) post[k] = String(v);

  if (!verifyPaytrCallback(post)) {
    return new Response("PAYTR notification failed: bad hash", { status: 400 });
  }

  const order = await prisma.order.findFirst({ where: { iyziToken: post.merchant_oid } });
  if (order && order.paymentStatus !== "PAID") {
    if (post.status === "success") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PREPARING",
          iyziPaymentId: post.payment_id ?? null,
        },
      });
      await sendOrderEmails(order.id);
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
    }
  }

  return new Response("OK");
}
