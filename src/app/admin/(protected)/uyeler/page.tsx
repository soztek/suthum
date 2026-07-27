import { Users, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMembers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: { select: { total: true, paymentStatus: true } },
    },
  });

  const totalMembers = users.length;
  const withOrders = users.filter((u) => u.orders.length > 0).length;

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-ink">
        <Users className="text-green-600" /> Üyeler <span className="text-base font-medium text-ink/40">({totalMembers})</span>
      </h1>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl border border-green-100 bg-white p-4">
          <p className="text-2xl font-extrabold text-green-700">{totalMembers}</p>
          <p className="text-sm text-ink/50">Toplam üye</p>
        </div>
        <div className="rounded-2xl border border-green-100 bg-white p-4">
          <p className="text-2xl font-extrabold text-orange-500">{withOrders}</p>
          <p className="text-sm text-ink/50">Sipariş veren üye</p>
        </div>
      </div>

      {totalMembers === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
          Henüz üye yok. Müşteriler siteden üye oldukça burada listelenir.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-green-100 bg-white">
          <div className="hidden grid-cols-[1fr_150px_110px_120px] gap-3 border-b border-green-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50 md:grid">
            <span>Üye</span><span>Telefon</span><span>Sipariş</span><span className="text-right">Toplam Harcama</span>
          </div>
          <div className="divide-y divide-green-50">
            {users.map((u) => {
              const paidTotal = u.orders
                .filter((o) => o.paymentStatus === "PAID")
                .reduce((s, o) => s + toNumber(o.total), 0);
              return (
                <div key={u.id} className="grid grid-cols-1 items-center gap-2 px-5 py-3 md:grid-cols-[1fr_150px_110px_120px]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-500 to-orange-400 text-xs font-bold text-white">
                      {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{u.name}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-ink/50"><Mail size={11} /> {u.email}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-ink/70">
                    {u.phone ? (<><Phone size={13} /> {u.phone}</>) : <span className="text-ink/30">—</span>}
                  </span>
                  <span className="text-sm">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">{u.orders.length}</span>
                  </span>
                  <span className="text-sm font-bold text-green-700 md:text-right">{formatPrice(paidTotal)}</span>
                  <span className="text-xs text-ink/40 md:hidden">Kayıt: {new Date(u.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
