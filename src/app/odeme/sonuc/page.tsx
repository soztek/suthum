import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, XCircle, Clock, Landmark, Copy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { BANK } from "@/lib/company";
import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";

export const metadata: Metadata = { title: "Sipariş Sonucu" };

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; order?: string }>;
}) {
  const { status, order: orderNo } = await searchParams;
  const order = orderNo
    ? await prisma.order.findUnique({ where: { orderNo }, include: { items: true } })
    : null;

  const success = status === "success";
  const isHavale = status === "havale";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {(success || isHavale) && <ClearCartOnSuccess />}
      <div className="rounded-3xl border border-green-100 bg-white p-8 text-center card-shadow">
        {isHavale ? (
          <>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100">
              <Landmark size={42} className="text-green-600" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-ink">Siparişiniz Alındı! 🎉</h1>
            <p className="mt-2 text-ink/60">
              Ödemeniz bekleniyor. Aşağıdaki IBAN'a <b>havale/EFT</b> yaptıktan sonra siparişiniz
              hazırlanmaya başlanacaktır.
            </p>
          </>
        ) : success ? (
          <>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100">
              <CheckCircle2 size={44} className="text-green-600" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-ink">Siparişiniz Alındı! 🎉</h1>
            <p className="mt-2 text-ink/60">
              Teşekkürler. Siparişiniz hazırlanıyor ve en kısa sürede soğuk zincirle kargoya verilecek.
            </p>
          </>
        ) : status === "failed" ? (
          <>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange-100">
              <XCircle size={44} className="text-orange-600" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-ink">Ödeme Tamamlanamadı</h1>
            <p className="mt-2 text-ink/60">Ödeme sırasında bir sorun oluştu. Lütfen tekrar deneyin.</p>
          </>
        ) : (
          <>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange-100">
              <Clock size={44} className="text-orange-600" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-ink">Bir Sorun Oluştu</h1>
            <p className="mt-2 text-ink/60">Sipariş durumu doğrulanamadı. Bize ulaşabilirsiniz.</p>
          </>
        )}

        {isHavale && order && (
          <div className="mt-6 rounded-2xl border-2 border-green-200 bg-white p-5 text-left">
            <div className="mb-3 flex items-center gap-2 font-bold text-ink">
              <Landmark size={18} className="text-green-600" /> Havale / EFT Bilgileri
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink/50">Alıcı</dt>
                <dd className="font-semibold text-ink">{BANK.accountName}</dd>
              </div>
              {BANK.bankName && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink/50">Banka</dt>
                  <dd className="font-semibold text-ink">{BANK.bankName}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink/50">IBAN</dt>
                <dd className="font-mono font-bold tracking-tight text-green-700">{BANK.iban}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-orange-50 px-3 py-2">
                <dt className="text-orange-800">Açıklama <span className="font-normal">(mutlaka yazın)</span></dt>
                <dd className="font-mono font-bold text-orange-800">{order.orderNo}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-green-100 pt-2.5">
                <dt className="font-semibold text-ink">Tutar</dt>
                <dd className="text-lg font-extrabold text-green-700">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-ink/50">
              <Copy size={13} className="mt-0.5 shrink-0" />
              Havale açıklamasına <b className="mx-1 text-ink/70">{order.orderNo}</b> sipariş numaranızı yazmayı unutmayın — ödemenizi bu numarayla eşleştiriyoruz.
            </p>
          </div>
        )}

        {order && (
          <div className="mt-6 rounded-2xl bg-green-50/60 p-5 text-left">
            <div className="flex items-center justify-between border-b border-green-100 pb-3">
              <span className="text-sm text-ink/60">Sipariş No</span>
              <span className="font-bold text-green-700">{order.orderNo}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span className="text-ink/70">
                    {it.name} <span className="text-ink/40">×{it.quantity}</span>
                  </span>
                  <span className="font-medium text-ink">{formatPrice(it.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-green-100 pt-3 font-bold">
              <span>Toplam</span>
              <span className="text-green-700">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-full bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700">
            Alışverişe Devam Et
          </Link>
          {!success && (
            <Link href="/sepet" className="rounded-full border border-green-200 px-7 py-3 font-semibold text-green-700 hover:bg-green-50">
              Sepete Dön
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
