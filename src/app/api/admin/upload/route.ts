import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { isAuthed } from "@/lib/auth";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    if (!(await isAuthed())) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Sadece JPEG/PNG/WebP/GIF" }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "Dosya 5MB'tan büyük olamaz" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${ext}`;

    // Ortamdaki tüm Blob read-write token'larını topla (prefix ve büyük/küçük harf bağımsız).
    const tokens = [
      process.env.BLOB_READ_WRITE_TOKEN,
      ...Object.keys(process.env)
        .filter((k) => k.toUpperCase().endsWith("_READ_WRITE_TOKEN"))
        .map((k) => process.env[k]),
    ].filter((v): v is string => Boolean(v));
    const uniqueTokens = [...new Set(tokens)];

    if (uniqueTokens.length > 0) {
      const { put } = await import("@vercel/blob");
      let lastError: unknown = null;
      // Her token'ı dene: private depo "public access" hatası verirse sonrakine geç,
      // public depo çalışınca dur.
      for (const token of uniqueTokens) {
        try {
          const blob = await put(`uploads/${filename}`, bytes, {
            access: "public",
            contentType: file.type,
            token,
          });
          return NextResponse.json({ url: blob.url });
        } catch (e) {
          lastError = e;
        }
      }
      throw lastError ?? new Error("Blob yüklemesi başarısız");
    }

    // Token yoksa OIDC (storeId) ile dene.
    const storeIdKey = Object.keys(process.env).find((k) =>
      k.toUpperCase().endsWith("_STORE_ID")
    );
    if (storeIdKey) {
      const { put } = await import("@vercel/blob");
      const opts = {
        access: "public",
        contentType: file.type,
        storeId: process.env[storeIdKey],
      } as Parameters<typeof put>[2];
      const blob = await put(`uploads/${filename}`, bytes, opts);
      return NextResponse.json({ url: blob.url });
    }

    // Vercel'de Blob yoksa diske yazılamaz (salt-okunur dosya sistemi).
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf deposu (Blob) bulunamadı. Vercel → Storage → Blob oluşturup projeye bağlayın ve yeniden deploy edin.",
        },
        { status: 500 }
      );
    }

    // Yerel geliştirme: public/uploads klasörüne yaz.
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Yükleme hatası:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Yükleme sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
