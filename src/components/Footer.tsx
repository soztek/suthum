import Link from "next/link";
import { Phone, Mail, MapPin, AtSign, ShieldCheck, Truck, Leaf } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export async function Footer() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  return (
    <footer className="mt-16 bg-green-800 text-green-50">
      {/* Güven şeridi */}
      <div className="border-b border-green-700/60">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="text-orange-300" size={28} />
            <div>
              <p className="font-semibold">Soğuk Zincir Gönderim</p>
              <p className="text-sm text-green-200">Tazeliği bozulmadan kapınızda</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="text-orange-300" size={28} />
            <div>
              <p className="font-semibold">%100 Doğal & Katkısız</p>
              <p className="text-sm text-green-200">Ardahan yaylalarından</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-orange-300" size={28} />
            <div>
              <p className="font-semibold">Güvenli Ödeme</p>
              <p className="text-sm text-green-200">SSL & 3D Secure altyapısı</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="inline-flex rounded-2xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SÜT-HÜM Süt Ürünleri" className="h-24 w-auto" />
          </div>
          <p className="mt-3 text-sm text-green-200">{settings.tagline}</p>
          <p className="mt-4 flex items-start gap-2 text-sm text-green-200">
            <MapPin size={16} className="mt-0.5 shrink-0 text-orange-300" /> {settings.address}
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Kategoriler</h4>
          <ul className="space-y-2 text-sm text-green-200">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="hover:text-orange-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Kurumsal</h4>
          <ul className="space-y-2 text-sm text-green-200">
            <li><Link href="/hakkimizda" className="hover:text-orange-300">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-orange-300">İletişim</Link></li>
            <li><Link href="/mesafeli-satis" className="hover:text-orange-300">Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link href="/gizlilik" className="hover:text-orange-300">Gizlilik & KVKK</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">İletişim</h4>
          <ul className="space-y-2.5 text-sm text-green-200">
            <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-orange-300"><Phone size={15} /> {settings.phone}</a></li>
            <li><a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-orange-300"><Mail size={15} /> {settings.email}</a></li>
            <li><a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-orange-300"><AtSign size={15} /> @{settings.instagram}</a></li>
            <li>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
                WhatsApp Sipariş
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-700/60 py-5 text-center text-xs text-green-300">
        © {new Date().getFullYear()} SÜTHÜM — {settings.tagline}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
