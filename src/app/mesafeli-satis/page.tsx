import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-extrabold text-ink">Mesafeli Satış Sözleşmesi</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
        <p>
          İşbu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
          Sözleşmeler Yönetmeliği hükümlerine uygun olarak düzenlenmiştir. Alıcı, siparişini onayladığında
          bu sözleşmenin tüm koşullarını kabul etmiş sayılır.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">1. Taraflar ve Konu</h2>
        <p>
          Bu sözleşme, SÜTHÜM (Satıcı) ile sitede sipariş veren müşteri (Alıcı) arasında, sipariş edilen
          ürünlerin satışı ve teslimine ilişkin hak ve yükümlülükleri düzenler.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">2. Teslimat</h2>
        <p>
          Ürünler, soğuk zincir gereksinimlerine uygun şekilde, sipariş onayından itibaren ortalama 2 iş günü
          içinde kargoya verilir. Kargo süresi bölgeye göre değişebilir.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">3. Cayma Hakkı</h2>
        <p>
          Gıda ürünlerinin niteliği gereği (çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler),
          ilgili mevzuat uyarınca cayma hakkı istisnaları uygulanabilir. Ayıplı ürünlerde değişim/iade
          süreçleri müşteri hizmetleri aracılığıyla yürütülür.
        </p>
        <p className="pt-4 text-sm text-ink/50">
          Not: Bu metin genel bilgilendirme amaçlıdır. Yayına almadan önce bir hukuk danışmanıyla
          işletmenize özel olarak güncellemeniz önerilir.
        </p>
      </div>
    </div>
  );
}
