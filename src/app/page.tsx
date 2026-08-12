import Link from "next/link";
import { ArrowRight, Truck, Leaf, Award, Snowflake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { Reviews } from "@/components/Reviews";

export default async function HomePage() {
  const [settings, categories, featured, packages] = await Promise.all([
    getSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true, category: { slug: { not: "paketler" } } },
      include: { category: true },
      take: 8,
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, category: { slug: "paketler" } },
      include: { category: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20">
              <Leaf size={15} className="text-orange-300" /> Ardahan'ın doğal lezzetleri
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-green-50/90">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kategori/paketler" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-base font-semibold shadow-lg transition hover:bg-orange-600">
                Paketleri Keşfet <ArrowRight size={18} />
              </Link>
              <Link href="#kategoriler" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-base font-semibold ring-1 ring-white/25 transition hover:bg-white/20">
                Tüm Ürünler
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-green-50/80">
              <span className="flex items-center gap-1.5"><Snowflake size={15} className="text-orange-300" /> Soğuk zincir</span>
              <span className="flex items-center gap-1.5"><Truck size={15} className="text-orange-300" /> Hızlı kargo</span>
              <span className="flex items-center gap-1.5"><Award size={15} className="text-orange-300" /> Katkısız üretim</span>
            </div>
          </div>

          {/* Görsel kolaj */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: "/hero/kasar.jpg", t: "Eski Kaşar" },
                { img: "/hero/bal.jpg", t: "Kara Kovan Balı" },
                { img: "/hero/sut.jpg", t: "Süt & Tereyağı" },
                { img: "/hero/kavurma.jpg", t: "Dana Kavurma" },
              ].map((x, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-3xl shadow-xl ring-1 ring-white/25"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={x.img}
                    alt={x.t}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 font-bold text-white drop-shadow-lg">{x.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section id="kategoriler" className="mx-auto max-w-7xl px-6 py-14">
        <SectionTitle kicker="Ne arıyorsunuz?" title="Kategoriler" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-green-100 bg-white p-5 text-center card-shadow hover-lift"
            >
              {c.imageUrl ? (
                <span className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-green-100 transition group-hover:scale-110">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                </span>
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-green-50 to-orange-50 text-3xl transition group-hover:scale-110">
                  {c.emoji}
                </span>
              )}
              <div>
                <p className="text-sm font-bold text-ink group-hover:text-green-700">{c.name}</p>
                <p className="text-xs text-ink/50">{c._count.products} ürün</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PAKETLER */}
      {packages.length > 0 && (
        <section className="bg-green-50/60 py-14">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle kicker="🔥 Kampanya" title="Avantajlı Paketler" href="/kategori/paketler" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => (
                <ProductCard key={p.id} product={toProductDTO(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ÖNE ÇIKANLAR */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <SectionTitle kicker="Çok satanlar" title="Öne Çıkan Ürünler" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
      </section>

      {/* MÜŞTERİ YORUMLARI */}
      <Reviews />

      {/* HİKAYE */}
      <section className="bg-gradient-to-br from-green-700 to-green-800 py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-300">Bizim Hikayemiz</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Yayladan sofraya, doğallığından ödün vermeden</h2>
            <p className="mt-5 text-green-50/90">
              Doğu Anadolu'nun temiz havası ve zengin bitki örtüsüyle beslenen Ardahan hayvanlarının sütünden,
              geleneksel yöntemlerle üretilen peynir, tereyağı ve balları; katkısız haliyle sofralarınıza taşıyoruz.
              Her ürün özenle seçilir, soğuk zincirle en taze şekilde kapınıza ulaşır.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { n: "100%", t: "Doğal & Katkısız" },
                { n: "1.500m", t: "Yüksek rakım" },
                { n: "48 saat", t: "İçinde kargo" },
              ].map((s) => (
                <div key={s.t} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15">
                  <p className="text-2xl font-extrabold text-orange-300">{s.n}</p>
                  <p className="mt-1 text-xs text-green-50/80">{s.t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["🐄", "🌾", "🏔️", "🧀", "🍯", "🧈", "🥛", "🌿", "☀️"].map((e, i) => (
              <div key={i} className="grid aspect-square place-items-center rounded-2xl bg-white/10 text-4xl ring-1 ring-white/15">
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">{kicker}</span>
        <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden items-center gap-1 whitespace-nowrap text-sm font-semibold text-green-700 hover:text-orange-600 sm:flex">
          Tümünü Gör <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
