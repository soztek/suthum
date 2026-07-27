import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, LogOut, ExternalLink } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { logoutAction } from "@/lib/admin-actions";

const NAV = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingCart },
  { href: "/admin/uyeler", label: "Üyeler", icon: Users },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-green-50/40">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Kenar menü */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-green-100 bg-white p-4 lg:flex">
          <Link href="/admin" className="mb-6 flex items-center px-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SÜT-HÜM" className="h-14 w-auto" />
          </Link>
          <nav className="flex-1 space-y-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-green-50 hover:text-green-700">
                <n.icon size={18} /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-1 border-t border-green-100 pt-3">
            <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-green-50">
              <ExternalLink size={18} /> Siteyi Gör
            </Link>
            <form action={logoutAction}>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50">
                <LogOut size={18} /> Çıkış Yap
              </button>
            </form>
          </div>
        </aside>

        {/* İçerik */}
        <div className="flex-1">
          {/* Mobil üst bar */}
          <div className="flex items-center gap-3 overflow-x-auto border-b border-green-100 bg-white px-4 py-3 lg:hidden no-scrollbar">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                <n.icon size={15} /> {n.label}
              </Link>
            ))}
          </div>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
