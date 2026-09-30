"use client";

import { Printer } from "lucide-react";

interface LabelData {
  orderNo: string;
  fullName: string;
  phone: string;
  address: string;
  district?: string | null;
  city: string;
  note?: string | null;
  createdAt: string; // gösterim için hazır string
  items: { name: string; quantity: number }[];
  total: string; // formatlanmış
  paymentMethod: string;
  paymentStatus: string;
}

interface Sender {
  name: string;
  address: string;
  phone: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PrintLabelButton({ order, sender }: { order: LabelData; sender: Sender }) {
  function print() {
    const itemsRows = order.items
      .map(
        (it) =>
          `<tr><td>${esc(it.name)}</td><td style="text-align:right;white-space:nowrap">×${it.quantity}</td></tr>`
      )
      .join("");

    const pay =
      order.paymentMethod === "havale" ? "Havale/EFT" : "Kredi/Banka Kartı";
    const payState = order.paymentStatus === "PAID" ? "ÖDENDİ" : "ÖDEME BEKLİYOR";

    const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><title>Kargo Etiketi ${esc(order.orderNo)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 16px; color: #111; }
  .label { width: 100%; max-width: 520px; margin: 0 auto; border: 2px solid #111; border-radius: 10px; overflow: hidden; }
  .brand { background: #147a3f; color: #fff; padding: 10px 16px; display:flex; justify-content:space-between; align-items:center; }
  .brand .n { font-size: 20px; font-weight: 800; }
  .brand .t { font-size: 11px; opacity:.9; }
  .row { padding: 12px 16px; border-bottom: 1px dashed #999; }
  .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .5px; color: #666; margin-bottom: 3px; }
  .rcpt-name { font-size: 20px; font-weight: 800; }
  .rcpt-addr { font-size: 15px; line-height: 1.45; margin-top: 2px; }
  .rcpt-phone { font-size: 16px; font-weight: 700; margin-top: 4px; }
  .sender { font-size: 12px; color: #333; }
  .ordno { font-size: 18px; font-weight: 800; letter-spacing: 1px; }
  .meta { display:flex; justify-content:space-between; font-size:12px; color:#333; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 4px; }
  td { padding: 3px 0; border-bottom: 1px solid #eee; }
  .total { text-align:right; font-weight:800; font-size:15px; margin-top:6px; }
  .pay { display:inline-block; padding:2px 8px; border:1px solid #147a3f; color:#147a3f; border-radius:20px; font-size:11px; font-weight:700; }
  .note { margin-top:6px; font-size:12px; color:#a15c00; }
  @media print { body { padding: 0; } .label { border-width: 1px; max-width: 100%; } .noprint { display:none; } }
  .btn { display:block; width:100%; max-width:520px; margin:14px auto 0; padding:12px; background:#147a3f; color:#fff; border:0; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer; }
</style></head>
<body>
  <div class="label">
    <div class="brand"><span class="n">SÜT-HÜM</span><span class="t">Ardahan Doğal Ürünler</span></div>

    <div class="row">
      <div class="lbl">Alıcı</div>
      <div class="rcpt-name">${esc(order.fullName)}</div>
      <div class="rcpt-addr">${esc(order.address)}${order.district ? ", " + esc(order.district) : ""}, ${esc(order.city)}</div>
      <div class="rcpt-phone">☎ ${esc(order.phone)}</div>
    </div>

    <div class="row sender">
      <div class="lbl">Gönderen</div>
      <b>${esc(sender.name)}</b><br>
      ${esc(sender.address)}<br>
      ☎ ${esc(sender.phone)}
    </div>

    <div class="row">
      <div class="meta"><span class="ordno">${esc(order.orderNo)}</span><span>${esc(order.createdAt)}</span></div>
      <div style="margin-top:4px"><span class="pay">${pay} · ${payState}</span></div>
    </div>

    <div class="row" style="border-bottom:0">
      <div class="lbl">İçerik</div>
      <table>${itemsRows}</table>
      <div class="total">Toplam: ${esc(order.total)}</div>
      ${order.note ? `<div class="note"><b>Not:</b> ${esc(order.note)}</div>` : ""}
    </div>
  </div>

  <button class="btn noprint" onclick="window.print()">🖨 Yazdır</button>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };</script>
</body></html>`;

    const w = window.open("", "_blank", "width=640,height=800");
    if (!w) {
      alert("Yazdırma penceresi açılamadı. Tarayıcı pop-up engelleyicisini kapatın.");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  return (
    <button
      type="button"
      onClick={print}
      className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
    >
      <Printer size={15} /> Kargo Etiketi Yazdır
    </button>
  );
}
