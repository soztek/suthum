# SÜT-HÜM — Vercel Yayına Alma Rehberi

Site kodu Vercel'e hazır: production build hatasız derleniyor, tüm sayfalar dinamik,
fotoğraf yükleme Vercel Blob'a uyumlu, Prisma build'e dahil.

## Adım 1 — Kodu GitHub'a gönder
1. https://github.com/new adresinde **boş** bir repo oluştur (ad: `suthum`, README ekleme).
2. Proje klasöründe (terminalde) şunu çalıştır (`<kullanici>` yerine GitHub kullanıcı adın):

```bash
git remote add origin https://github.com/<kullanici>/suthum.git
git branch -M main
git push -u origin main
```
İlk push'ta tarayıcı GitHub girişi açılır (Git Credential Manager) — onayla.

## Adım 2 — Vercel'de projeyi içe aktar
1. https://vercel.com → **Add New… → Project** → `suthum` reposunu **Import** et.
2. Framework otomatik **Next.js** algılanır. Henüz **Deploy'a basma**, önce depolama ekle.

## Adım 3 — Depolama ekle (Storage sekmesi)
1. **Postgres** (Neon) oluştur → `DATABASE_URL` otomatik eklenir.
2. **Blob** oluştur → `BLOB_READ_WRITE_TOKEN` otomatik eklenir.

## Adım 4 — Ortam değişkenlerini (Environment Variables) ekle
| Değişken | Değer |
|---|---|
| `AUTH_SECRET` | `6cf4cc48a429df3a77c1687d712a6d21bb06ebb829a594526a8a1d79b48f9037` |
| `ADMIN_EMAIL` | `admin@suthum.com` (istediğin e-posta) |
| `ADMIN_PASSWORD` | güçlü bir şifre belirle |
| `NEXT_PUBLIC_BASE_URL` | ilk deploy sonrası verilen adres (ör. `https://suthum.vercel.app`) |
| `IYZICO_BASE_URL` | `https://sandbox-api.iyzipay.com` |

> `DATABASE_URL` ve `BLOB_READ_WRITE_TOKEN` Adım 3'te otomatik gelir.
> iyzico gerçek ödeme anahtarları (`IYZICO_API_KEY`, `IYZICO_SECRET_KEY`) sonradan eklenir;
> boş kalırsa site DEMO ödeme modunda çalışır.

## Adım 5 — Deploy
**Deploy**'a bas. Build tamamlanınca `.vercel.app` adresi verilir.
`NEXT_PUBLIC_BASE_URL`'i bu adresle güncelleyip yeniden deploy et.

## Adım 6 — Veritabanı şeması + örnek veri
Neon `DATABASE_URL`'ini Vercel Storage sekmesinden kopyala ve bana ver;
şemayı uygular ve örnek Ardahan ürünlerini yüklerim. (Ya da yerelde:
`DATABASE_URL="<neon-url>" npx prisma db push` ve `npx tsx prisma/seed.ts`.)

## Adım 7 — (Sonra) Alan adı ve ödeme
- `suthum.com`'u Vercel'e yönlendir (mevcut WordPress siteyi değiştirir — hazır olunca).
- iyzico canlı anahtarlarını ekle → gerçek ödemeye geç.
