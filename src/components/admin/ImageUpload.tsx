"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

export function ImageUpload({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: `Sunucu beklenmedik yanıt verdi (HTTP ${res.status}).` };
      }
      if (!res.ok || !data.url) throw new Error(data.error || `Yükleme başarısız (HTTP ${res.status})`);
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">Ürün Görseli</label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        <div className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-green-200 bg-green-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Önizleme" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={28} className="text-green-300" />
          )}
          {url && (
            <button type="button" onClick={() => setUrl("")} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/60 text-white hover:bg-ink" aria-label="Kaldır">
              <X size={13} />
            </button>
          )}
        </div>
        <div>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-full border border-green-300 px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-60">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Yükleniyor..." : url ? "Görseli Değiştir" : "Görsel Yükle"}
          </button>
          <p className="mt-2 text-xs text-ink/50">JPEG / PNG / WebP · en fazla 5MB</p>
          {error && <p className="mt-1 text-xs text-orange-600">{error}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} className="hidden" />
    </div>
  );
}
