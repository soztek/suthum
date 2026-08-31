import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi" };

export default async function Page() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-extrabold text-ink">Mesafeli Satış Sözleşmesi</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
        <p>
          İşbu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
          Sözleşmeler Yönetmeliği hükümlerine uygun olarak düzenlenmiştir. Alıcı, siparişini onayladığında
          bu sözleşmenin tüm koşullarını kabul etmiş sayılır.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">1. Satıcı Bilgileri</h2>
        <div className="rounded-xl bg-green-50/60 p-4 text-sm">
          <p><b>Ünvan:</b> {COMPANY.legalName}</p>
          <p><b>Yetkili:</b> {COMPANY.owner}</p>
          <p><b>Adres:</b> {COMPANY.address}</p>
          <p><b>Vergi Dairesi / No:</b> {COMPANY.taxOffice} · {COMPANY.taxNo}</p>
          <p><b>Telefon:</b> {s.phone} · <b>E-posta:</b> {s.email}</p>
        </div>

        <h2 className="pt-2 text-lg font-bold text-ink">2. Konu</h2>
        <p>
          Bu sözleşme, yukarıda bilgileri verilen Satıcı ile sitede sipariş veren müşteri (Alıcı) arasında,
          sipariş edilen ürünlerin satışı ve teslimine ilişkin hak ve yükümlülükleri düzenler. Ürünün temel
          nitelikleri, satış fiyatı (KDV dahil) ve ödeme bilgileri, sipariş sayfasında ve sipariş özetinde yer alır.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">3. Teslimat</h2>
        <p>
          Ürünler, soğuk zincir gereksinimlerine uygun şekilde, ödeme onayından itibaren ortalama 1-3 iş günü
          içinde kargoya verilir. Kargo süresi bölgeye göre değişebilir. Ayrıntılar için Teslimat ve Kargo
          Bilgileri sayfasına bakınız.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">4. Cayma Hakkı</h2>
        <p>
          Gıda ürünlerinin niteliği gereği (çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler),
          Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca cayma hakkı istisnaları uygulanır. Ayıplı/hasarlı
          ürünlerde değişim ve iade süreçleri İptal, İade ve Değişim Koşulları sayfasındaki esaslara göre yürütülür.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">5. Uyuşmazlıkların Çözümü</h2>
        <p>
          İşbu sözleşmeden doğabilecek uyuşmazlıklarda, ilgili mevzuatça belirlenen parasal sınırlar dahilinde
          Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
        </p>
      </div>
    </div>
  );
}
