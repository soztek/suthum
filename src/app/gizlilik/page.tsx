import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gizlilik ve KVKK" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-extrabold text-ink">Gizlilik ve KVKK Politikası</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
        <p>
          SÜTHÜM olarak kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin
          Korunması Kanunu (KVKK) kapsamında, verileriniz yalnızca siparişinizin işlenmesi, teslimatı ve
          yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">Toplanan Veriler</h2>
        <p>Ad-soyad, iletişim bilgileri, teslimat adresi ve sipariş bilgileri.</p>
        <h2 className="pt-2 text-lg font-bold text-ink">Kullanım Amacı</h2>
        <p>Siparişin hazırlanması, kargolanması ve müşteri desteğinin sağlanması.</p>
        <h2 className="pt-2 text-lg font-bold text-ink">Ödeme Güvenliği</h2>
        <p>
          Kart bilgileriniz sitemizde saklanmaz; ödemeler lisanslı ödeme kuruluşu (iyzico) altyapısı üzerinden
          SSL ve 3D Secure ile güvenli şekilde alınır.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">Çerezler</h2>
        <p>Alışveriş deneyimini iyileştirmek için zorunlu çerezler kullanılır.</p>
      </div>
    </div>
  );
}
