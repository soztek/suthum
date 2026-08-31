import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { toNumber, formatPrice } from "@/lib/utils";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Teslimat ve Kargo Bilgileri" };

export default async function Page() {
  const s = await getSettings();
  const limit = formatPrice(toNumber(s.freeShippingLimit));
  const fee = formatPrice(toNumber(s.shippingFee));

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-extrabold text-ink">Teslimat ve Kargo Bilgileri</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
        <h2 className="pt-2 text-lg font-bold text-ink">Kargo Süresi</h2>
        <p>
          Siparişleriniz, ödeme onayından sonra ortalama <b>1-3 iş günü</b> içinde hazırlanıp kargoya verilir.
          Kargo firmasının teslim süresi bölgeye göre genelde <b>1-4 iş günü</b> arasında değişir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">Soğuk Zincir Gönderim</h2>
        <p>
          Süt ürünleri gibi soğuk zincir gerektiren ürünler, tazeliğini koruyacak şekilde uygun ambalaj ve
          gönderim koşullarıyla sevk edilir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">Kargo Ücreti</h2>
        <p>
          <b>{limit}</b> ve üzeri siparişlerde kargo <b>ücretsizdir.</b> Bu tutarın altındaki siparişlerde kargo
          ücreti <b>{fee}</b> olarak uygulanır. Kargo ücreti, sipariş özeti ve ödeme adımında açıkça gösterilir.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">Teslimat Bölgesi</h2>
        <p>Türkiye'nin her yerine gönderim yapılmaktadır.</p>

        <h2 className="pt-2 text-lg font-bold text-ink">Teslimat Sırasında</h2>
        <p>
          Ürününüzü teslim alırken kolinin hasarsız olduğunu kontrol etmenizi öneririz. Hasarlı geldiğini
          düşündüğünüz bir gönderiyi kargo görevlisi yanındayken açıp tutanak tutturabilir, ardından bizimle
          iletişime geçebilirsiniz.
        </p>

        <h2 className="pt-2 text-lg font-bold text-ink">İletişim</h2>
        <p>
          Kargo ve teslimatla ilgili sorularınız için: <b>{s.phone}</b> · <b>{s.email}</b>
          <br />
          {COMPANY.legalName} — {COMPANY.address}
        </p>
      </div>
    </div>
  );
}
