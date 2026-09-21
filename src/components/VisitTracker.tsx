"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const KEY = "suthum_visit_day";

/**
 * Ziyaretçiyi GÜNDE 1 KEZ /api/track'e kaydeder (DB yükünü düşürmek için).
 * /admin yolları sayılmaz; botlar sunucu tarafında elenir.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (!pathname || pathname.startsWith("/admin")) return;

    const today = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(KEY) === today) {
        done.current = true;
        return;
      }
    } catch {
      /* localStorage yoksa yine de bir kez say */
    }

    done.current = true;
    try {
      localStorage.setItem(KEY, today);
    } catch {
      /* yoksay */
    }
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* yoksay */
    }
  }, [pathname]);

  return null;
}
