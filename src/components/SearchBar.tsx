"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit?: string | null;
  imageUrl?: string | null;
  categoryEmoji?: string | null;
  categoryImage?: string | null;
}

export function SearchBar({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  // 3+ harfte anlık arama (debounce'lu)
  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goAll() {
    const term = q.trim();
    if (term) {
      setOpen(false);
      router.push(`/arama?q=${encodeURIComponent(term)}`);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    goAll();
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit} className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          type="text"
          placeholder="Ürün ara... (kaşar, bal, tereyağı)"
          aria-label="Ürün ara"
          className="w-full rounded-full border border-green-200 bg-white py-2.5 pl-11 pr-24 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
        <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700">
          Ara
        </button>
      </form>

      {open && q.trim().length >= 3 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-xl">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-ink/50">
              <Loader2 size={16} className="animate-spin" /> Aranıyor…
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-ink/50">Sonuç bulunamadı</div>
          ) : (
            <>
              <ul className="max-h-96 overflow-y-auto">
                {results.map((r) => {
                  const thumb = r.imageUrl || r.categoryImage;
                  return (
                    <li key={r.id}>
                      <Link
                        href={`/urun/${r.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50"
                      >
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-50 text-lg">
                            {r.categoryEmoji ?? "🧺"}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{r.name}</p>
                          {r.unit && <p className="text-xs text-ink/50">{r.unit}</p>}
                        </div>
                        <span className="shrink-0 text-sm font-bold text-green-700">{formatPrice(r.price)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={goAll}
                className="block w-full border-t border-green-100 bg-green-50/50 px-3 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50"
              >
                Tüm sonuçları gör →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
