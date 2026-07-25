import "server-only";
// iyzipay resmi tip paketi sunmuyor; CommonJS modülü olarak alıyoruz.
// @ts-expect-error - tip tanımı yok
import Iyzipay from "iyzipay";

export function isPaymentLive(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

function client() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
  });
}

export interface CheckoutBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  ip: string;
}

export interface CheckoutBasketItem {
  id: string;
  name: string;
  category: string;
  price: string; // "12.34"
}

export interface InitResult {
  token: string;
  paymentPageUrl: string;
  checkoutFormContent: string;
}

/** iyzico Checkout Form başlatır (hosted ödeme sayfası). */
export function initCheckoutForm(params: {
  conversationId: string;
  basketId: string;
  price: string; // sepet toplamı (ürünler)
  paidPrice: string; // tahsil edilecek (ürünler + kargo)
  callbackUrl: string;
  buyer: CheckoutBuyer;
  items: CheckoutBasketItem[];
}): Promise<InitResult> {
  const iyzipay = client();
  const [name, ...rest] = params.buyer.name.split(" ");
  const surname = params.buyer.surname || rest.join(" ") || name;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: params.conversationId,
    price: params.price,
    paidPrice: params.paidPrice,
    currency: Iyzipay.CURRENCY.TRY,
    basketId: params.basketId,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: params.callbackUrl,
    enabledInstallments: [1, 2, 3, 6],
    buyer: {
      id: params.buyer.id,
      name,
      surname,
      gsmNumber: "+90" + params.buyer.phone.replace(/\D/g, "").slice(-10),
      email: params.buyer.email,
      identityNumber: "11111111111",
      registrationAddress: params.buyer.address,
      ip: params.buyer.ip,
      city: params.buyer.city,
      country: "Türkiye",
    },
    shippingAddress: {
      contactName: params.buyer.name,
      city: params.buyer.city,
      country: "Türkiye",
      address: params.buyer.address,
    },
    billingAddress: {
      contactName: params.buyer.name,
      city: params.buyer.city,
      country: "Türkiye",
      address: params.buyer.address,
    },
    basketItems: params.items.map((it) => ({
      id: it.id,
      name: it.name,
      category1: it.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: it.price,
    })),
  };

  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: Record<string, string>) => {
      if (err) return reject(err);
      if (result.status !== "success") {
        return reject(new Error(result.errorMessage || "iyzico başlatma hatası"));
      }
      resolve({
        token: result.token,
        paymentPageUrl: result.paymentPageUrl,
        checkoutFormContent: result.checkoutFormContent,
      });
    });
  });
}

/** Ödeme sonucunu token ile doğrular. */
export function retrieveCheckout(token: string): Promise<{ paid: boolean; paymentId?: string }> {
  const iyzipay = client();
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      { locale: Iyzipay.LOCALE.TR, token },
      (err: unknown, result: Record<string, string>) => {
        if (err) return reject(err);
        resolve({
          paid: result.paymentStatus === "SUCCESS" && result.status === "success",
          paymentId: result.paymentId,
        });
      }
    );
  });
}
