"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/arama?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={submit} className={`relative ${className}`}>
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder="Ürün ara... (kaşar, bal, tereyağı)"
        aria-label="Ürün ara"
        className="w-full rounded-full border border-green-200 bg-white py-2.5 pl-11 pr-24 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
      >
        Ara
      </button>
    </form>
  );
}
