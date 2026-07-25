import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { toNumber } from "@/lib/utils";
import { isPaymentLive } from "@/lib/iyzico";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Ödeme" };

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-ink">Sipariş & Ödeme</h1>
      <CheckoutForm
        freeShippingLimit={toNumber(settings.freeShippingLimit)}
        shippingFee={toNumber(settings.shippingFee)}
        paymentLive={isPaymentLive()}
      />
    </div>
  );
}
