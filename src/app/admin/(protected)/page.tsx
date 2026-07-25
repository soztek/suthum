import Link from "next/link";
import { Package, ShoppingCart, Wallet, Clock, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, toNumber } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [productCount, orderCount, pendingCount, paidOrders, recent] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
  ]);

  const revenue = paidOrders.reduce((s, o) => s + toNumber(o.total), 0);

  const stats = [
    { label: "Toplam Ciro", value: formatPrice(revenue), icon: Wallet, color: "bg-green-100 text-green-700" },
    { label: "Sipariş", value: orderCount, icon: ShoppingCart, color: "bg-orange-100 text-orange-700" },
    { label: "Bekleyen", value: pendingCount, icon: Clock, color: "bg-orange-100 text-orange-700" },
    { label: "Ürün", value: productCount, icon: Package, color: "bg-green-100 text-green-700" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-ink">Panel</h1>
        <Link href="/admin/urunler/yeni" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={17} /> Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-green-100 bg-white p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-full ${s.color}`}>
              <s.icon size={20} />
            </span>
            <p className="mt-3 text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-green-100 bg-white">
        <div className="flex items-center justify-between border-b border-green-100 px-5 py-4">
          <h2 className="font-bold text-ink">Son Siparişler</h2>
          <Link href="/admin/siparisler" className="text-sm font-semibold text-green-700 hover:underline">Tümü</Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-ink/50">Henüz sipariş yok.</p>
        ) : (
          <div className="divide-y divide-green-50">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{o.fullName}</p>
                  <p className="text-xs text-ink/50">{o.orderNo} · {o.items.length} ürün</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={o.status} />
                  <span className="font-bold text-green-700">{formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
