import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisitTracker } from "@/components/VisitTracker";
import { getSettings } from "@/lib/settings";
import { toNumber } from "@/lib/utils";

// Site tamamen veritabanından beslendiği için tüm sayfalar dinamik render edilir.
// (Vercel build sırasında DB'ye ihtiyaç duyulmaz.)
export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SÜTHÜM — Ardahan'ın Doğal Lezzetleri",
    template: "%s | SÜTHÜM",
  },
  description:
    "Ardahan yaylalarından doğal ve katkısız yöresel ürünler: eski kaşar, kara kovan balı, köy tereyağı, kavurma ve daha fazlası. Soğuk zincirle kapınızda.",
  keywords: ["Ardahan", "yöresel ürünler", "kaşar", "bal", "tereyağı", "peynir", "suthum"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  return (
    <html lang="tr" className={`${manrope.variable} antialiased`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <VisitTracker />
          <Header />
          <main className="min-h-[60vh] flex-1">{children}</main>
          <Footer />
          <CartDrawer freeShippingLimit={toNumber(settings.freeShippingLimit)} />
        </CartProvider>
      </body>
    </html>
  );
}
