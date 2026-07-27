import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { updateOrderStatus } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
};

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Siparişler <span className="text-base font-medium text-ink/40">({orders.length})</span></h1>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
          Henüz sipariş yok.
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

              <form action={updateOrderStatus} className="flex flex-wrap items-center gap-2 border-t border-green-50 pt-4">
                <input type="hidden" name="id" value={o.id} />
                <label className="text-sm font-medium text-ink/60">Durum:</label>
                <select name="status" defaultValue={o.status} className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{LABELS[s]}</option>
                  ))}
                </select>
                <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                  Güncelle
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
