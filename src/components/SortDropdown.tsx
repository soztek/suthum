"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const OPTIONS = [
  { value: "", label: "Önerilen" },
  { value: "fiyat-artan", label: "Fiyat: Düşükten Yükseğe" },
  { value: "fiyat-azalan", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "isim", label: "İsim: A-Z" },
  { value: "yeni", label: "En Yeniler" },
];

export function SortDropdown({ current }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    router.push(v ? `${pathname}?sirala=${v}` : pathname, { scroll: false });
  }

  return (
    <label className="relative flex items-center">
      <ArrowUpDown size={15} className="pointer-events-none absolute left-3 text-ink/40" />
      <select
        value={current ?? ""}
        onChange={onChange}
        aria-label="Sıralama"
        className="appearance-none rounded-full border border-green-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-ink outline-none focus:border-green-500"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 h-4 w-4 text-ink/40" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </label>
  );
}
