import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "İptal, İade ve Değişim Koşulları" };

export default async function Page() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-extrabold text-ink">İptal, İade ve Değişim Koşulları</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
        <p>
          {COMPANY.legalName} olarak müşteri memnuniyetini önemsiyoruz. Aşağıdaki koşullar, 6502 sayılı
          Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak
          düzenlenmiştir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">1. Cayma Hakkı</h2>
        <p>
          Tüketici, sözleşmenin kurulduğu (siparişin verildiği) tarihten itibaren <b>14 gün</b> içinde, herhangi
          bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">2. Cayma Hakkının İstisnaları (Gıda Ürünleri)</h2>
        <p>
          Yönetmeliğin 15. maddesi gereği; <b>çabuk bozulabilen veya son kullanma tarihi geçebilecek</b> ürünler,
          tesliminden sonra ambalajı açılmış olan ve iadesi sağlık/hijyen açısından uygun olmayan ürünlerde
          <b> cayma hakkı kullanılamaz.</b> Süt ürünleri (peynir, tereyağı vb.), bal, pekmez ve benzeri gıda
          ürünleri bu kapsamdadır. Bu nedenle ayıpsız/sağlam teslim edilen gıda ürünlerinde iade kabul edilememektedir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">3. Ayıplı / Hasarlı Ürün</h2>
        <p>
          Ürün size hasarlı, bozulmuş, eksik veya sipariş ettiğinizden farklı ulaştıysa; teslimattan itibaren
          <b> 48 saat</b> içinde bize ulaşarak durumu bildirin. Bu tür durumlarda ürün ücretsiz olarak değiştirilir
          veya bedeli iade edilir. Değerlendirme için ürünün ve varsa hasarın fotoğrafını iletmeniz süreci hızlandırır.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">4. İade / Bedel İadesi Süreci</h2>
        <p>
          Onaylanan iadelerde ürün bedeli, ödeme yaptığınız yönteme (kredi kartı/banka kartı) <b>iş günü içinde
          10 gün</b> içerisinde iade edilir. Kredi kartına yapılan iadelerin hesabınıza yansıma süresi bankanıza
          göre değişebilir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">5. Sipariş İptali</h2>
        <p>
          Siparişiniz kargoya verilmeden önce iptal talebinde bulunabilirsiniz. Kargolanmış siparişlerde yukarıdaki
          cayma/iade koşulları geçerlidir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">6. İletişim</h2>
        <p>
          İptal, iade ve değişim talepleriniz için: <b>{s.phone}</b> · <b>{s.email}</b>
          <br />
          Satıcı: {COMPANY.legalName} — {COMPANY.address}
        </p>

        <p className="pt-4 text-sm text-ink/50">
          Not: Bu metin bilgilendirme amaçlıdır; yayına almadan önce bir hukuk danışmanıyla işletmenize özel olarak
          gözden geçirmeniz önerilir.
        </p>
      </div>
    </div>
  );
}
