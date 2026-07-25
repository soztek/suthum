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

    // Üretim (Vercel): kalıcı depolama için Vercel Blob'a yükle.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, bytes, {
        access: "public",
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Vercel'de Blob token yoksa diske yazılamaz (salt-okunur dosya sistemi).
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf deposu (Blob) yapılandırılmamış. Vercel → Storage → Blob oluşturup projeye bağlayın ve yeniden deploy edin.",
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
