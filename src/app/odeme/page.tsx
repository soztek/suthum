import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/user-auth";
import { toNumber } from "@/lib/utils";
import { isPaymentLive } from "@/lib/iyzico";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Ödeme" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()]);
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-extrabold text-ink">Sipariş & Ödeme</h1>
      {!user && (
        <p className="mb-6 text-sm text-ink/60">
          Üyeysen{" "}
          <Link href="/giris" className="font-semibold text-green-700 hover:underline">giriş yap</Link>{" "}
          — bilgilerin otomatik dolsun ve siparişini takip et. Ya da misafir olarak devam et.
        </p>
      )}
      <CheckoutForm
        freeShippingLimit={toNumber(settings.freeShippingLimit)}
        shippingFee={toNumber(settings.shippingFee)}
        paymentLive={isPaymentLive()}
        initial={
          user
            ? {
                fullName: user.name,
                email: user.email,
                phone: user.phone ?? "",
                city: user.city ?? "",
                address: user.address ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
