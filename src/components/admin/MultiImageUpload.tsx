"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Star } from "lucide-react";

export function MultiImageUpload({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
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
        setUrls((prev) => [...prev, data.url!]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(i: number) {
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }
  function makeCover(i: number) {
    setUrls((prev) => {
      const a = [...prev];
      const [x] = a.splice(i, 1);
      return [x, ...a];
    });
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">Ürün Görselleri</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u + i} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-green-200 bg-green-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            {i === 0 ? (
              <span className="absolute left-1 top-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">Kapak</span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(i)}
                title="Kapak yap"
                className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded bg-white/85 text-green-700 opacity-0 transition group-hover:opacity-100 hover:bg-white"
              >
                <Star size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              title="Kaldır"
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/60 text-white hover:bg-ink"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid h-24 w-24 place-items-center rounded-xl border-2 border-dashed border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-60"
        >
          {uploading ? <Loader2 size={22} className="animate-spin" /> : (
            <span className="flex flex-col items-center gap-1 text-xs font-semibold"><Upload size={20} /> Ekle</span>
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-ink/50">
        Birden fazla seçebilirsin. <b>İlk görsel kapak</b> olur (kartlarda o görünür). Yıldıza basıp kapağı değiştirebilirsin.
      </p>
      {error && <p className="mt-1 text-xs text-orange-600">{error}</p>}
      <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFiles} className="hidden" />
    </div>
  );
}
