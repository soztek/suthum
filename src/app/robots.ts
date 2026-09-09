import type { MetadataRoute } from "next";

const BASE = "https://suthum.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Dizine girmemesi gereken özel/işlevsel yollar
      disallow: ["/admin", "/api", "/sepet", "/odeme", "/hesabim", "/giris", "/kayit", "/arama"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
