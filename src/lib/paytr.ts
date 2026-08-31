import "server-only";
import crypto from "crypto";

export function isPaytrLive(): boolean {
  return Boolean(
    process.env.PAYTR_MERCHANT_ID &&
      process.env.PAYTR_MERCHANT_KEY &&
      process.env.PAYTR_MERCHANT_SALT
  );
}

export interface PaytrTokenParams {
  merchantOid: string; // sadece harf+rakam
  email: string;
  amount: number; // TL cinsinden (ör. 1329.90)
  userName: string;
  userAddress: string;
  userPhone: string;
  userIp: string;
  basket: [string, string, number][]; // [ürün adı, birim fiyat "12.34", adet]
  okUrl: string;
  failUrl: string;
}

/** PayTR get-token API'sinden iframe token'ı alır. */
export async function getPaytrToken(
  p: PaytrTokenParams
): Promise<{ ok: boolean; token?: string; error?: string }> {
  const merchant_id = process.env.PAYTR_MERCHANT_ID!;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
  const test_mode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";
  const no_installment = "0";
  const max_installment = "0";
  const currency = "TL";
  const payment_amount = Math.round(p.amount * 100).toString(); // kuruş
  const user_basket = Buffer.from(JSON.stringify(p.basket)).toString("base64");

  const hashStr =
    merchant_id +
    p.userIp +
    p.merchantOid +
    p.email +
    payment_amount +
    user_basket +
    no_installment +
    max_installment +
    currency +
    test_mode;
  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hashStr + merchant_salt)
    .digest("base64");

  const body = new URLSearchParams({
    merchant_id,
    user_ip: p.userIp,
    merchant_oid: p.merchantOid,
    email: p.email,
    payment_amount,
    paytr_token,
    user_basket,
    debug_on: test_mode === "1" ? "1" : "0",
    no_installment,
    max_installment,
    user_name: p.userName,
    user_address: p.userAddress,
    user_phone: p.userPhone,
    merchant_ok_url: p.okUrl,
    merchant_fail_url: p.failUrl,
    timeout_limit: "30",
    currency,
    test_mode,
  });

  try {
    const res = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { status: string; token?: string; reason?: string };
    if (data.status === "success" && data.token) {
      return { ok: true, token: data.token };
    }
    return { ok: false, error: data.reason || "PayTR token alınamadı" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "PayTR bağlantı hatası" };
  }
}

/** PayTR bildirim (callback) POST'unun hash'ini doğrular. */
export function verifyPaytrCallback(post: Record<string, string>): boolean {
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
  const calc = crypto
    .createHmac("sha256", merchant_key)
    .update(post.merchant_oid + merchant_salt + post.status + post.total_amount)
    .digest("base64");
  return calc === post.hash;
}
