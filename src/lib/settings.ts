import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

/**
 * Site ayarlarını getirir; yoksa varsayılan tek satırı oluşturur.
 * unstable_cache ile istekler arası önbelleklenir (DB yükünü düşürür).
 * Panelde ayar değişince admin-actions revalidateTag("settings") ile anında yeniler.
 */
export const getSettings = unstable_cache(
  async () => {
    let settings = await prisma.setting.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.setting.create({ data: { id: "main" } });
    }
    return settings;
  },
  ["settings-main"],
  { tags: ["settings"], revalidate: 300 }
);

export type Settings = Awaited<ReturnType<typeof getSettings>>;
