const MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Bekliyor", cls: "bg-orange-100 text-orange-700" },
  PREPARING: { label: "Hazırlanıyor", cls: "bg-green-100 text-green-700" },
  SHIPPED: { label: "Kargoda", cls: "bg-green-100 text-green-700" },
  DELIVERED: { label: "Teslim Edildi", cls: "bg-green-600 text-white" },
  CANCELLED: { label: "İptal", cls: "bg-red-100 text-red-700" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? MAP.PENDING;
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}
