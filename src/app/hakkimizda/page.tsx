import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Snowflake, Award, Heart } from "lucide-react";

export const metadata: Metadata = { title: "Hakkımızda" };

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-green-700 to-green-800 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-300">Hakkımızda</span>
          <h1 className="mt-3 text-4xl font-extrabold">Ardahan'ın bereketini sofranıza taşıyoruz</h1>
          <p className="mt-4 text-lg text-green-50/90">
            SÜTHÜM, Ardahan'ın yüksek yaylalarında geleneksel yöntemlerle üretilen doğal ürünleri,
            tazeliğinden ödün vermeden sizlere ulaştırma sevdasıyla kuruldu.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="prose prose-green max-w-none text-ink/80">
          <p className="text-lg leading-relaxed">
            Doğu Anadolu'nun eşsiz coğrafyasında, 1.500 metreyi aşan rakımda, temiz hava ve zengin bitki
            örtüsüyle beslenen hayvanların sütü; peynirin, tereyağının ve balın en kalitelisini doğurur.
            Biz de bu bereketi, üreticiden alıp aracısız şekilde sofranıza getiriyoruz.
          </p>
          <p className="leading-relaxed">
            Her ürünümüz katkısız, hormonsuz ve geleneksel usullerle üretilir. Kaşarımız şirden mayasıyla
            olgunlaşır, balımız yüksek rakım çiçeklerinden süzülür, tereyağımız mayıs otlarının kokusunu taşır.
            Ürünlerimizi soğuk zincir gönderimle, tazeliği hiç bozulmadan kapınıza kadar getiriyoruz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Leaf, t: "Doğal & Katkısız", d: "Hormonsuz, katkısız üretim" },
            { i: Snowflake, t: "Soğuk Zincir", d: "Tazeliği korunarak gönderim" },
            { i: Award, t: "Geleneksel Usul", d: "Yöresel tarifler, el emeği" },
            { i: Heart, t: "Üreticiden Direkt", d: "Aracısız, adil ticaret" },
          ].map((x, i) => (
            <div key={i} className="rounded-2xl border border-green-100 bg-white p-6 text-center card-shadow">
              <x.i size={32} className="mx-auto text-green-600" />
              <h3 className="mt-3 font-bold text-ink">{x.t}</h3>
              <p className="mt-1 text-sm text-ink/60">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex rounded-full bg-orange-500 px-8 py-3.5 font-semibold text-white hover:bg-orange-600">
            Ürünleri Keşfet
          </Link>
        </div>
      </section>
    </div>
  );
}
