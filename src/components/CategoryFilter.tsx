"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function CategoryFilter({
  categories,
  current,
}: {
  categories: { slug: string; name: string }[];
  current?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const p = new URLSearchParams(params.toString());
    if (e.target.value) p.set("kategori", e.target.value);
    else p.delete("kategori");
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <label className="relative flex items-center">
      <select
        value={current ?? ""}
        onChange={onChange}
        aria-label="Kategori"
        className="appearance-none rounded-full border border-green-200 bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink outline-none focus:border-green-500"
      >
        <option value="">Tüm Kategoriler</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 h-4 w-4 text-ink/40" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </label>
  );
}
