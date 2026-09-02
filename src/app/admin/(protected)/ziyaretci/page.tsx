import { Users, Eye, CalendarDays, Fingerprint } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// İstanbul saatine göre bir günün başlangıcını (UTC anı olarak) döndürür.
function istanbulDayStart(daysAgo = 0): Date {
  const now = new Date();
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const start = new Date(`${ymd}T00:00:00+03:00`);
  start.setDate(start.getDate() - daysAgo);
  return start;
}

function istanbulDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default async function VisitorsPage() {
  const startToday = istanbulDayStart(0);
  const start7 = istanbulDayStart(6); // bugün dahil son 7 gün

  const [totalViews, ipsAll, viewsToday, ipsToday, last7Raw, topPaths, recent] =
    await Promise.all([
      prisma.visit.count(),
      prisma.visit.groupBy({ by: ["ip"] }),
      prisma.visit.count({ where: { createdAt: { gte: startToday } } }),
      prisma.visit.groupBy({ by: ["ip"], where: { createdAt: { gte: startToday } } }),
      prisma.visit.findMany({
        where: { createdAt: { gte: start7 } },
        select: { ip: true, createdAt: true },
      }),
      prisma.visit.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 10,
      }),
      prisma.visit.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { id: true, ip: true, path: true, createdAt: true },
      }),
    ]);

  const uniqueIpsAll = ipsAll.length;
  const uniqueIpsToday = ipsToday.length;

  // Son 7 günü güne göre grupla (İstanbul tarihi)
  const dayMap = new Map<string, { views: number; ips: Set<string> }>();
  for (let i = 6; i >= 0; i--) {
    const key = istanbulDate(istanbulDayStart(i));
    dayMap.set(key, { views: 0, ips: new Set() });
  }
  for (const v of last7Raw) {
    const key = istanbulDate(new Date(v.createdAt));
    const bucket = dayMap.get(key);
    if (bucket) {
      bucket.views++;
      bucket.ips.add(v.ip);
    }
  }
  const days = [...dayMap.entries()].map(([date, b]) => ({
    date,
    views: b.views,
    ips: b.ips.size,
  }));
  const maxDayViews = Math.max(1, ...days.map((d) => d.views));

  const cards = [
    { label: "Farklı IP (Toplam)", value: uniqueIpsAll, icon: Fingerprint, hl: true },
    { label: "Bugün Farklı IP", value: uniqueIpsToday, icon: Users },
    { label: "Toplam Görüntüleme", value: totalViews, icon: Eye },
    { label: "Bugün Görüntüleme", value: viewsToday, icon: CalendarDays },
  ];

  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Ziyaretçiler</h1>
      <p className="mt-1 text-sm text-ink/50">
        Siteye giren farklı IP adresleri ve sayfa görüntülemeleri (yönetim paneli sayılmaz).
      </p>

      {/* Özet kartlar */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border p-5 ${
              c.hl ? "border-green-200 bg-green-50/70" : "border-green-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-2 text-ink/50">
              <c.icon size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-green-700">
              {c.value.toLocaleString("tr-TR")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Son 7 gün */}
        <div className="rounded-2xl border border-green-100 bg-white p-6">
          <h2 className="text-lg font-bold text-ink">Son 7 Gün</h2>
          <div className="mt-4 space-y-3">
            {days.map((d) => {
              const dt = new Date(`${d.date}T12:00:00+03:00`);
              const label = `${dayNames[dt.getDay()]} ${dt.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
              })}`;
              return (
                <div key={d.date} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 text-ink/50">{label}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-green-50">
                    <div
                      className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-green-500 to-green-600 px-2 text-xs font-semibold text-white"
                      style={{ width: `${Math.max(6, (d.views / maxDayViews) * 100)}%` }}
                    >
                      {d.views > 0 ? d.views : ""}
                    </div>
                  </div>
                  <span className="w-24 shrink-0 text-right text-ink/60">
                    {d.ips} farklı IP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* En çok görüntülenen sayfalar */}
        <div className="rounded-2xl border border-green-100 bg-white p-6">
          <h2 className="text-lg font-bold text-ink">En Çok Görüntülenen Sayfalar</h2>
          {topPaths.length === 0 ? (
            <p className="mt-4 text-sm text-ink/40">Henüz veri yok.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {topPaths.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-ink" title={p.path}>
                    {p.path === "/" ? "Ana Sayfa" : p.path}
                  </span>
                  <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700">
                    {p._count.path.toLocaleString("tr-TR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Son ziyaretler */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-green-100 bg-white">
        <div className="border-b border-green-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Son Ziyaretler</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink/40">Henüz ziyaret kaydı yok.</p>
        ) : (
          <div className="divide-y divide-green-50">
            <div className="hidden grid-cols-[160px_1fr_200px] gap-3 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink/40 sm:grid">
              <span>IP Adresi</span>
              <span>Sayfa</span>
              <span className="text-right">Zaman</span>
            </div>
            {recent.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-1 gap-1 px-5 py-2.5 text-sm sm:grid-cols-[160px_1fr_200px] sm:gap-3"
              >
                <span className="font-mono text-ink/70">{v.ip}</span>
                <span className="truncate text-ink" title={v.path}>
                  {v.path === "/" ? "Ana Sayfa" : v.path}
                </span>
                <span className="text-ink/50 sm:text-right">
                  {new Date(v.createdAt).toLocaleString("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
