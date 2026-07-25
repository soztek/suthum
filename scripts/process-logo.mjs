import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "SÜTHÜM LOGO SON UYGULAMA PNG.png");
const pub = path.join(root, "public");

async function run() {
  const meta = await sharp(src).metadata();
  console.log("Orijinal:", meta.width, "x", meta.height, meta.format, "kanal:", meta.channels, "alpha:", meta.hasAlpha);

  // Şeffaf kenarları kırp (top-left piksel referans alınır)
  const trimmed = await sharp(src).trim({ threshold: 10 }).toBuffer();
  const tMeta = await sharp(trimmed).metadata();
  console.log("Kırpılmış:", tMeta.width, "x", tMeta.height);

  // 1) Tam logo (şeffaf zemin korunur) -> public/logo.png
  await sharp(trimmed)
    .resize({ width: 900, withoutEnlargement: true })
    .png()
    .toFile(path.join(pub, "logo.png"));

  // 2) Kare ikon (beyaz zemin) -> favicon için
  const side = Math.max(tMeta.width, tMeta.height);
  await sharp(trimmed)
    .resize({ width: side, height: side, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: "#ffffff" })
    .resize(256, 256)
    .png()
    .toFile(path.join(pub, "logo-icon.png"));

  console.log("Bitti.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
