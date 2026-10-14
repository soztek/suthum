import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Landmark } from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { PrintLabelButton } from "@/components/admin/PrintLabelButton";
import { updateOrderStatus, markOrderPaid } from "@/lib/admin-actions";
import { getSettings } from "@/lib/settings";
import { COMPANY } from "@/lib/company";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
};

// Ödeme durumuna göre sekmeler
const TABS = [
  { key: "paid", label: "Ödenen", where: { paymentStatus: "PAID" as const } },
  { key: "pending", label: "Ödeme Bekleyen", where: { paymentStatus: "PENDING" as const } },
  { key: "failed", label: "Başarısız", where: { paymentStatus: "FAILED" as const } },
  { key: "all", label: "Tümü", where: {} },
] as const;

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { durum } = await searchParams;
  const active = TABS.find((t) => t.key === durum) ?? TABS[0]; // varsayılan: Ödenen

  const [orders, settings, counts] = await Promise.all([
    prisma.order.findMany({
      where: active.where,
      orderBy: { createdAt: "desc" },
      include: { items: true, user: { select: { name: true } } },
    }),
    getSettings(),
    prisma.order.groupBy({ by: ["paymentStatus"], _count: { _all: true } }),
  ]);

  const countOf = (ps: "PAID" | "PENDING" | "FAILED") =>
    counts.find((c) => c.paymentStatus === ps)?._count._all ?? 0;
  const totalCount = counts.reduce((s, c) => s + c._count._all, 0);
  const tabCount: Record<string, number> = {
    paid: countOf("PAID"),
    pending: countOf("PENDING"),
    failed: countOf("FAILED"),
    all: totalCount,
  };

  const sender = {
    name: COMPANY.legalName,
    address: COMPANY.address,
    phone: settings.phone,
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Siparişler <span className="text-base font-medium text-ink/40">({tabCount[active.key]})</span></h1>

      {/* Ödeme durumu sekmeleri */}
      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const isActive = t.key === active.key;
          return (
            <Link
              key={t.key}
              href={t.key === "paid" ? "/admin/siparisler" : `/admin/siparisler?durum=${t.key}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? "bg-green-600 text-white" : "border border-green-200 bg-white text-ink/70 hover:bg-green-50"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20" : "bg-green-50 text-green-700"}`}>
                {tabCount[t.key]}
              </span>
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
          Bu bölümde sipariş yok.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-green-100 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-green-50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-700">{o.orderNo}</span>
                    <OrderStatusBadge status={o.status} />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${o.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {o.paymentStatus === "PAID" ? "Ödendi" : o.paymentStatus === "FAILED" ? "Başarısız" : "Ödeme Bekliyor"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${o.user ? "bg-green-600 text-white" : "bg-ink/10 text-ink/50"}`}>
                      {o.user ? "Üye" : "Misafir"}
                    </span>
                    {o.paymentMethod === "havale" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        <Landmark size={11} /> Havale
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink/50">
                    {new Date(o.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
                <span className="text-xl font-extrabold text-green-700">{formatPrice(o.total)}</span>
              </div>

              <div className="grid gap-4 py-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/40">Müşteri</h4>
                  <p className="text-sm font-medium text-ink">{o.fullName}</p>
                  <p className="text-sm text-ink/60">{o.phone} · {o.email}</p>
                  <p className="mt-1 text-sm text-ink/60">{o.address}, {o.district ? `${o.district}, ` : ""}{o.city}</p>
                  {o.note && <p className="mt-1 text-sm text-orange-700">Not: {o.note}</p>}
                </div>
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/40">Ürünler</h4>
                  <ul className="space-y-1 text-sm">
                    {o.items.map((it) => (
                      <li key={it.id} className="flex justify-between">
                        <span className="text-ink/70">{it.name} ×{it.quantity}</span>
                        <span className="font-medium text-ink">{formatPrice(it.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-green-50 pt-4">
                <form action={updateOrderStatus} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <label className="text-sm font-medium text-ink/60">Durum:</label>
                  <select key={o.status} name="status" defaultValue={o.status} className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{LABELS[s]}</option>
                    ))}
                  </select>
                  <input
                    name="trackingNo"
                    defaultValue={o.trackingNo ?? ""}
                    placeholder="Kargo takip no (ops.)"
                    className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                  <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    Güncelle
                  </button>
                </form>
                {o.paymentStatus !== "PAID" && (
                  <form action={markOrderPaid}>
                    <input type="hidden" name="id" value={o.id} />
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50">
                      <Landmark size={15} /> Ödemeyi Onayla
                    </button>
                  </form>
                )}
                <PrintLabelButton
                  sender={sender}
                  order={{
                    orderNo: o.orderNo,
                    fullName: o.fullName,
                    phone: o.phone,
                    address: o.address,
                    district: o.district,
                    city: o.city,
                    note: o.note,
                    createdAt: new Date(o.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }),
                    items: o.items.map((it) => ({ name: it.name, quantity: it.quantity })),
                    total: formatPrice(o.total),
                    paymentMethod: o.paymentMethod,
                    paymentStatus: o.paymentStatus,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
