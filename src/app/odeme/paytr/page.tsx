import Link from "next/link";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PaytrIframe } from "@/components/checkout/PaytrIframe";

export const metadata: Metadata = { title: "Güvenli Ödeme" };
export const dynamic = "force-dynamic";

export default async function PaytrPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-ink/60">Ödeme oturumu bulunamadı.</p>
        <Link href="/sepet" className="mt-3 inline-block rounded-full bg-green-600 px-6 py-2.5 font-semibold text-white hover:bg-green-700">
          Sepete Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 flex items-center justify-center gap-2 text-2xl font-extrabold text-ink">
        <Lock size={20} className="text-green-600" /> Güvenli Ödeme
      </h1>
      <p className="mb-5 text-center text-sm text-ink/50">Kart bilgileriniz PayTR güvenli altyapısında işlenir.</p>
      <PaytrIframe token={token} />
    </div>
  );
}
