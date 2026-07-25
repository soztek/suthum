import { prisma } from "./prisma";
import { cache } from "react";

/** Site ayarlarını getirir; yoksa varsayılan tek satırı oluşturur. */
export const getSettings = cache(async () => {
  let settings = await prisma.setting.findUnique({ where: { id: "main" } });
  if (!settings) {
    settings = await prisma.setting.create({ data: { id: "main" } });
  }
  return settings;
});

export type Settings = Awaited<ReturnType<typeof getSettings>>;
