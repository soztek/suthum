"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavCat {
  name: string;
  slug: string;
  emoji?: string | null;
  imageUrl?: string | null;
}

export function MobileNav({
  categories,
  userName,
}: {
  categories: NavCat[];
  userName?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Menü açıkken arka planın kaymasını engelle
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const overlay = open ? (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <nav className="absolute left-0 top-0 flex h-full w-72 max-w-[82%] flex-col overflow-y-auto bg-cream p-5 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SÜT-HÜM" className="h-11 w-auto" />
          <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-ink/60 hover:bg-green-50" aria-label="Kapat">
            <X size={22} />
          </button>
        </div>
        <div className="space-y-1">
          <Link href="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-green-50">
            Anasayfa
          </Link>
          <Link href="/urunler" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-green-50">
            Tüm Ürünler
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-green-50"
            >
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span>{c.emoji}</span>
              )}
              {c.name}
            </Link>
          ))}
          <Link href="/hakkimizda" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-green-50">
            Hakkımızda
          </Link>
          <Link href="/iletisim" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-green-50">
            İletişim
          </Link>
        </div>

        <div className="mt-4 border-t border-green-100 pt-4">
          {userName ? (
            <Link href="/hesabim" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 font-semibold text-green-700">
              👤 Hesabım ({userName.split(" ")[0]})
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link href="/giris" onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-green-200 px-3 py-2.5 text-center font-semibold text-green-700 hover:bg-green-50">
                Giriş
              </Link>
              <Link href="/kayit" onClick={() => setOpen(false)} className="flex-1 rounded-lg bg-orange-500 px-3 py-2.5 text-center font-semibold text-white hover:bg-orange-600">
                Üye Ol
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full text-green-700 hover:bg-green-50 lg:hidden"
        aria-label="Menü"
      >
        <Menu size={24} />
      </button>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
