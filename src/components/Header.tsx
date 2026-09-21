import Link from "next/link";
import { Phone, User, Percent } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getNavCategories } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/user-auth";
import { CartButton } from "./cart/CartButton";
import { MobileNav } from "./MobileNav";
import { CategoryIcon } from "./CategoryIcon";
import { SearchBar } from "./SearchBar";

export async function Header() {
  const [settings, categories, user] = await Promise.all([
    getSettings(),
    getNavCategories(),
    getCurrentUser(),
  ]);

  return (
    <>
      {/* Duyuru şeridi */}
      <div className="overflow-hidden bg-green-700 text-white">
        <div className="flex whitespace-nowrap py-2 text-xs font-medium sm:text-sm">
          <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex items-center gap-2">
                🚚 {settings.announcement}
                <span className="text-orange-300">•</span>
                📞 Sipariş Hattı: {settings.phone}
                <span className="text-orange-300">•</span>
                ❄️ Soğuk zincir gönderim
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-green-100 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <MobileNav categories={categories} userName={user?.name ?? null} />

          <Link href="/" className="flex shrink-0 items-center" aria-label={settings.siteName}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SÜT-HÜM Süt Ürünleri" className="h-12 w-auto sm:h-14" />
          </Link>

          {/* Anasayfa + Tüm Ürünler — logonun yanında */}
          <Link href="/" className="hidden shrink-0 text-[15px] font-semibold text-ink transition hover:text-green-700 lg:block">
            Anasayfa
          </Link>
          <Link href="/urunler" className="hidden shrink-0 text-[15px] font-semibold text-ink transition hover:text-green-700 lg:block">
            Tüm Ürünler
          </Link>

          {/* Arama — Anasayfa ile telefon arasında (masaüstü) */}
          <div className="hidden flex-1 justify-center px-3 lg:flex">
            <SearchBar className="w-full max-w-xl" />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hidden items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 md:flex">
              <Phone size={16} /> {settings.phone}
            </a>
            {user ? (
              <Link
                href="/hesabim"
                className="hidden items-center gap-2 rounded-full border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 sm:flex"
              >
                <User size={16} />
                <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="hidden items-center gap-2 rounded-full border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 sm:flex"
                >
                  <User size={16} />
                  <span className="hidden lg:inline">Giriş</span>
                </Link>
                <Link
                  href="/kayit"
                  className="hidden items-center rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 sm:flex"
                >
                  Üye Ol
                </Link>
              </>
            )}
            <CartButton />
          </div>
        </div>

        {/* Arama satırı (yalnız mobil) */}
        <div className="border-t border-green-100 px-4 py-2.5 lg:hidden">
          <div className="mx-auto max-w-3xl">
            <SearchBar />
          </div>
        </div>

        {/* Kategori menüsü — ikonlu çubuk (masaüstü) */}
        <nav className="relative hidden overflow-hidden border-t border-green-200 bg-white lg:block">
          {/* Logo filigranı (soluk arka plan deseni) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "url(/logo.png)",
              backgroundSize: "auto 135%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto flex max-w-7xl items-stretch justify-center">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                className="group flex flex-1 flex-col items-center gap-2 border-l-2 border-green-200/70 px-3 py-4 transition first:border-l-0 hover:bg-green-50/70"
              >
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.name} className="h-20 w-20 rounded-full object-cover ring-2 ring-green-100 transition group-hover:scale-110" />
                ) : (
                  <CategoryIcon slug={c.slug} className="h-14 w-14 text-ink/70 transition group-hover:text-green-600" />
                )}
                <span className="text-center text-sm font-semibold text-ink group-hover:text-green-700">{c.name}</span>
              </Link>
            ))}
            {/* Kampanyalar — özel dikkat çekici buton (Paketler'in yanında) */}
            <Link
              href="/kampanyalar"
              className="group relative flex flex-1 flex-col items-center gap-2 border-l-2 border-green-200/70 px-3 py-4 transition hover:bg-orange-50/70"
            >
              <span className="relative grid h-20 w-20 place-items-center">
                {/* nabız halkası */}
                <span className="absolute inset-0 rounded-full bg-orange-400/40 animate-ping" />
                <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-200 transition group-hover:scale-110">
                  <Percent size={30} strokeWidth={2.6} />
                </span>
                {/* FIRSAT rozeti */}
                <span className="absolute -right-1 -top-1 z-10 rotate-6 rounded-full bg-green-700 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow ring-2 ring-white">
                  Fırsat
                </span>
              </span>
              <span className="text-center text-sm font-extrabold text-orange-600 group-hover:text-orange-700">Kampanyalar</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
