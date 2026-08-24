"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

export function ViewToggle({ current }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const view = current === "liste" ? "liste" : "izgara";

  function set(v: "izgara" | "liste") {
    const p = new URLSearchParams(params.toString());
    if (v === "izgara") p.delete("gorunum");
    else p.set("gorunum", v);
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const base = "grid h-9 w-9 place-items-center rounded-lg transition";
  return (
    <div className="flex items-center gap-1 rounded-xl border border-green-200 bg-white p-1">
      <button
        type="button"
        onClick={() => set("izgara")}
        aria-label="Izgara görünüm"
        className={`${base} ${view === "izgara" ? "bg-green-600 text-white" : "text-ink/50 hover:bg-green-50"}`}
      >
        <LayoutGrid size={17} />
      </button>
      <button
        type="button"
        onClick={() => set("liste")}
        aria-label="Liste görünüm"
        className={`${base} ${view === "liste" ? "bg-green-600 text-white" : "text-ink/50 hover:bg-green-50"}`}
      >
        <List size={17} />
      </button>
    </div>
  );
}
