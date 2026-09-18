"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const KEY = "suthum_popup_seen";

export function CampaignPopup({
  active,
  title,
  text,
  imageUrl,
  ctaText,
  ctaLink,
}: {
  active: boolean;
  title: string;
  text: string;
  imageUrl?: string | null;
  ctaText?: string;
  ctaLink?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hasContent = active && (title.trim() || text.trim());
  // İçerik imzası: kampanya değişince (aynı gün olsa bile) popup yeniden gösterilir.
  const sig = `${title}|${text}|${imageUrl ?? ""}`;

  useEffect(() => {
    if (!hasContent) return;
    if (pathname?.startsWith("/admin")) return;

    const today = new Date().toISOString().slice(0, 10);
    const token = `${sig}__${today}`;
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {
      seen = null;
    }
    if (seen === token) return;

    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hasContent, sig]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(KEY, `${sig}__${today}`);
    } catch {
      /* yoksay */
    }
    setOpen(false);
  }

  if (!open) return null;

  const isExternal = !!ctaLink && /^https?:\/\//i.test(ctaLink);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-up"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Kapat"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
        >
          <X size={18} />
        </button>

        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
        )}

        <div className="p-6 text-center">
          {title.trim() && <h2 className="text-2xl font-extrabold text-ink">{title}</h2>}
          {text.trim() && (
            <p className="mt-3 whitespace-pre-line text-ink/70">{text}</p>
          )}

          {ctaText?.trim() && ctaLink?.trim() ? (
            isExternal ? (
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-5 inline-flex rounded-full bg-orange-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600"
              >
                {ctaText}
              </a>
            ) : (
              <Link
                href={ctaLink}
                onClick={close}
                className="mt-5 inline-flex rounded-full bg-orange-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600"
              >
                {ctaText}
              </Link>
            )
          ) : (
            <button
              onClick={close}
              className="mt-5 inline-flex rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Alışverişe Başla
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
