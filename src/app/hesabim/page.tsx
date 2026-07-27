import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { User, Mail, Phone, LogOut, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { userLogoutAction } from "@/lib/user-actions";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export const metadata: Metadata = { title: "Hesabım" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-ink">Hesabım</h1>
        <form action={userLogoutAction}>
          <button className="inline-flex items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-ink hover:bg-green-50">
            <LogOut size={16} /> Çıkış Yap
          </button>
        </form>
      </div>

      {/* Profil */}
      <div className="mt-6 rounded-2xl border border-green-100 bg-white p-6 card-shadow">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-500 to-orange-400 text-lg font-bold text-white">
            {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-bold text-ink"><User size={15} /> {user.name}</p>
            <p className="mt-0.5 flex items-center gap-2 text-sm text-ink/60"><Mail size={14} /> {user.email}</p>
            {user.phone && <p className="mt-0.5 flex items-center gap-2 text-sm text-ink/60"><Phone size={14} /> {user.phone}</p>}
          </div>
        </div>
      </div>

      {/* Siparişler */}
      <h2 className="mt-8 mb-3 flex items-center gap-2 text-lg font-bold text-ink">
        <Package size={18} className="text-green-600" /> Siparişlerim ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-green-200 bg-white p-10 text-center">
          <p className="text-ink/60">Henüz siparişin yok.</p>
          <Link href="/" className="mt-3 inline-block rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-green-100 bg-white p-5 card-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-700">{o.orderNo}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
                <span className="text-sm text-ink/50">{new Date(o.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between text-ink/70">
                    <span>{it.name} ×{it.quantity}</span>
                    <span className="font-medium text-ink">{formatPrice(it.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-green-50 pt-3 font-bold">
                <span>Toplam</span>
                <span className="text-green-700">{formatPrice(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
