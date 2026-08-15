import Link from "next/link";
import { Phone, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/user-auth";
import { CartButton } from "./cart/CartButton";
import { MobileNav } from "./MobileNav";
import { CategoryIcon } from "./CategoryIcon";
import { SearchBar } from "./SearchBar";

export async function Header() {
  const [settings, categories, user] = await Promise.all([
    getSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true, emoji: true, imageUrl: true },
    }),
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

          {/* Anasayfa — logonun yanında */}
          <Link href="/" className="hidden shrink-0 text-[15px] font-semibold text-ink transition hover:text-green-700 lg:block">
            Anasayfa
          </Link>

          {/* Arama — Anasayfa ile telefon arasında (masaüstü) */}
          <div className="hidden flex-1 justify-center px-3 lg:flex">
            <SearchBar className="w-full max-w-xl" />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hidden items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 md:flex">
              <Phone size={16} /> {settings.phone}
            </a>
            <Link
              href={user ? "/hesabim" : "/giris"}
              className="hidden items-center gap-2 rounded-full border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 sm:flex"
            >
              <User size={16} />
              <span className="hidden lg:inline">{user ? user.name.split(" ")[0] : "Giriş"}</span>
            </Link>
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
          </div>
        </nav>
      </header>
    </>
  );
}
