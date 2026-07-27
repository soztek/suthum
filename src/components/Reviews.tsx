import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  city: string;
  text: string;
}

// Örnek yorumlar — panelden yönetilebilir hale getirilene kadar yer tutucudur.
const REVIEWS: Review[] = [
  {
    name: "Ayşe K.",
    city: "İstanbul",
    text: "Eski kaşarın tadı tam çocukluğumdaki gibi, kahvaltıların vazgeçilmezi oldu. Soğuk zincirle geldiği için de tertemiz ulaştı.",
  },
  {
    name: "Mehmet D.",
    city: "Ankara",
    text: "Kara kovan balını ilk kez denedim, aroması bambaşka. Katkısız olduğu ilk kaşıkta belli oluyor. Kesinlikle tavsiye ederim.",
  },
  {
    name: "Zeynep A.",
    city: "İzmir",
    text: "Mayıs tereyağı ve göravye peyniri harikaydı. Ardahan'ın o eşsiz lezzetini şehirde bulmak paha biçilmez.",
  },
  {
    name: "Hakan T.",
    city: "Bursa",
    text: "Sipariş çok hızlı geldi, paketleme özenliydi. Fermente sucuk enfes, kısa sürede yeniden sipariş verdim.",
  },
  {
    name: "Elif S.",
    city: "Antalya",
    text: "Ailece bayıldık. Özellikle eski kaşar ve çiçek balı bir harika. Doğal ürün güveniyle alışveriş yapmak çok değerli.",
  },
  {
    name: "Okan Y.",
    city: "Kocaeli",
    text: "Gerçek köy ürünü bulmak zor; burada gönül rahatlığıyla alışveriş yapıyorum. Kavurma tam kıvamında geldi.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Reviews() {
  return (
    <section className="bg-green-50/50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        {/* Başlık + genel puan */}
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Müşterilerimiz
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
            Bizden Alışveriş Yapanlar Ne Diyor?
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 card-shadow">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-orange-400 text-orange-400" />
              ))}
            </span>
            <span className="text-sm text-ink/70">
              <b className="text-ink">4.9</b> / 5 · <span className="text-ink/60">2.400+ değerlendirme</span>
            </span>
          </div>
        </div>

        {/* Yorum kartları */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <div key={i} className="relative flex flex-col rounded-2xl border border-green-100 bg-white p-6 card-shadow">
              <Quote size={38} className="absolute right-5 top-5 fill-green-50 text-green-100" />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={16} className="fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="mt-3 flex-1 leading-relaxed text-ink/75">“{r.text}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-green-50 pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-500 to-orange-400 text-sm font-bold text-white">
                  {initials(r.name)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{r.name}</p>
                  <p className="text-xs text-ink/50">{r.city} · Onaylı Alışveriş</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
