import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iyzipay dinamik require kullanıyor; paketlenmesin, çalışma anında native require ile yüklensin.
  serverExternalPackages: ["iyzipay"],
};

export default nextConfig;
