import type { Metadata } from "next";
import { Phone, Mail, MapPin, AtSign, MessageCircle } from "lucide-react";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "İletişim" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">Bize Ulaşın</span>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">İletişim</h1>
        <p className="mt-2 text-ink/60">Soru, öneri ve siparişleriniz için buradayız.</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-6 card-shadow hover-lift">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-green-50"><Phone className="text-green-600" /></span>
          <div><p className="text-sm text-ink/50">Telefon</p><p className="font-semibold text-ink">{s.phone}</p></div>
        </a>
        <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-6 card-shadow hover-lift">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-green-50"><MessageCircle className="text-green-600" /></span>
          <div><p className="text-sm text-ink/50">WhatsApp</p><p className="font-semibold text-ink">Hemen Yaz</p></div>
        </a>
        <a href={`mailto:${s.email}`} className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-6 card-shadow hover-lift">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-green-50"><Mail className="text-green-600" /></span>
          <div><p className="text-sm text-ink/50">E-posta</p><p className="font-semibold text-ink">{s.email}</p></div>
        </a>
        <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-6 card-shadow hover-lift">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-green-50"><AtSign className="text-green-600" /></span>
          <div><p className="text-sm text-ink/50">Instagram</p><p className="font-semibold text-ink">@{s.instagram}</p></div>
        </a>
      </div>

      <div className="mt-4 flex items-start gap-4 rounded-2xl border border-green-100 bg-white p-6 card-shadow">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-green-50"><MapPin className="text-green-600" /></span>
        <div><p className="text-sm text-ink/50">Adres</p><p className="font-semibold text-ink">{s.address}</p></div>
      </div>
    </div>
  );
}
