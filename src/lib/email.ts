import "server-only";
import { Resend } from "resend";
import { prisma } from "./prisma";
import { getSettings } from "./settings";
import { formatPrice } from "./utils";
import { BANK } from "./company";

export function isEmailLive(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function itemsTable(items: { name: string; quantity: number; lineTotal: unknown }[]): string {
  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333">${it.name} <span style="color:#999">×${it.quantity}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#333;font-weight:600">${formatPrice(
          it.lineTotal as number
        )}</td>
      </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin-top:8px">${rows}</table>`;
}

function shell(title: string, body: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fbf9f4;border-radius:16px;overflow:hidden;border:1px solid #e6efe8">
    <div style="background:linear-gradient(135deg,#147a3f,#0f5f31);padding:22px 24px;color:#fff">
      <div style="font-size:22px;font-weight:800">SÜT-HÜM</div>
      <div style="font-size:13px;opacity:.85">Ardahan'ın Doğal Lezzetleri</div>
    </div>
    <div style="padding:24px">
      <h2 style="margin:0 0 12px;color:#1a2b23">${title}</h2>
      ${body}
    </div>
    <div style="padding:16px 24px;background:#0c4a27;color:#cdebd6;font-size:12px;text-align:center">
      SÜT-HÜM · suthum.com
    </div>
  </div>`;
}

/** Sipariş sonrası müşteriye onay + işletmeye bildirim maili gönderir. Hata siparişi bozmaz. */
export async function sendOrderEmails(orderId: string): Promise<void> {
  if (!isEmailLive()) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return;

    const settings = await getSettings();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.MAIL_FROM || "SÜT-HÜM <siparis@suthum.com>";
    const adminTo = process.env.MAIL_ADMIN || process.env.ADMIN_EMAIL || settings.email;

    const summary = `
      <p style="color:#555;margin:0 0 4px">Sipariş No: <b style="color:#147a3f">${order.orderNo}</b></p>
      ${itemsTable(order.items)}
      <div style="margin-top:12px;padding-top:12px;border-top:2px solid #147a3f;font-weight:800;color:#1a2b23">
        <span>Toplam: </span><span style="color:#147a3f">${formatPrice(order.total as unknown as number)}</span>
      </div>`;

    const isHavale = order.paymentMethod === "havale";

    // Havale ise IBAN + açıklama bloğu
    const havaleBlock = isHavale
      ? `
      <div style="margin-top:16px;padding:16px;background:#fff;border:2px solid #bfe3cb;border-radius:12px">
        <div style="font-weight:800;color:#147a3f;margin-bottom:10px">🏦 Havale / EFT Bilgileri</div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333">
          <tr><td style="padding:4px 0;color:#888">Alıcı</td><td style="padding:4px 0;text-align:right;font-weight:600">${BANK.accountName}</td></tr>
          ${BANK.bankName ? `<tr><td style="padding:4px 0;color:#888">Banka</td><td style="padding:4px 0;text-align:right;font-weight:600">${BANK.bankName}</td></tr>` : ""}
          <tr><td style="padding:4px 0;color:#888">IBAN</td><td style="padding:4px 0;text-align:right;font-weight:700;color:#147a3f">${BANK.iban}</td></tr>
          <tr><td style="padding:4px 0;color:#888">Tutar</td><td style="padding:4px 0;text-align:right;font-weight:800">${formatPrice(order.total as unknown as number)}</td></tr>
        </table>
        <div style="margin-top:10px;padding:10px 12px;background:#fff5ea;border-radius:8px;color:#a15c00;font-size:13px">
          Havale <b>açıklamasına</b> sipariş numaranızı yazın: <b>${order.orderNo}</b><br/>
          Ödemeniz hesabımıza geçtikten sonra siparişiniz hazırlanmaya başlar.
        </div>
      </div>`
      : "";

    // 1) Müşteriye onay
    await resend.emails.send({
      from,
      to: order.email,
      subject: isHavale
        ? `Siparişiniz alındı, ödeme bekleniyor — ${order.orderNo}`
        : `Siparişiniz alındı — ${order.orderNo}`,
      html: shell(
        isHavale ? "Siparişiniz alındı — ödeme bekleniyor 🏦" : "Siparişiniz alındı! 🎉",
        `<p style="color:#555">Merhaba ${order.fullName}, ${
          isHavale
            ? "siparişiniz için teşekkürler. Aşağıdaki IBAN'a havale/EFT yaptıktan sonra siparişiniz hazırlanmaya başlanacaktır."
            : "siparişiniz için teşekkürler. Hazırlanıyor ve en kısa sürede kargoya verilecek."
        }</p>${summary}${havaleBlock}
         <p style="color:#777;font-size:13px;margin-top:16px">Teslimat: ${order.address}, ${order.district ? order.district + ", " : ""}${order.city}</p>`
      ),
    });

    // 2) İşletmeye yeni sipariş bildirimi
    await resend.emails.send({
      from,
      to: adminTo,
      subject: `🛒 Yeni sipariş — ${order.orderNo} (${formatPrice(order.total as unknown as number)})${isHavale ? " · HAVALE" : ""}`,
      html: shell(
        "Yeni Sipariş Geldi",
        `${
          isHavale
            ? `<div style="margin-bottom:12px;padding:10px 14px;background:#fff5ea;border-radius:10px;color:#a15c00;font-size:14px;font-weight:600">🏦 Havale/EFT siparişi — ödeme geldiğinde panelden "Ödemeyi Onayla" yapın.</div>`
            : ""
        }${summary}
         <div style="margin-top:16px;padding:14px;background:#eaf7ef;border-radius:10px;color:#333;font-size:14px">
           <b>Ödeme:</b> ${isHavale ? "Havale / EFT" : "Kredi/Banka Kartı"}<br/>
           <b>Müşteri:</b> ${order.fullName}<br/>
           <b>Telefon:</b> ${order.phone}<br/>
           <b>E-posta:</b> ${order.email}<br/>
           <b>Adres:</b> ${order.address}, ${order.district ? order.district + ", " : ""}${order.city}
           ${order.note ? `<br/><b>Not:</b> ${order.note}` : ""}
         </div>`
      ),
    });
  } catch (err) {
    console.error("Sipariş maili gönderilemedi:", err);
  }
}
