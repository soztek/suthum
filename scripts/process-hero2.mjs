import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const out = path.join(root, "public", "hero");

const jobs = [
  { src: "eski kaşar.png", name: "kasar.jpg" },
  { src: "tereyağı.png", name: "sut.jpg" },
  { src: "yöresel ürünler.png", name: "yoresel.jpg" },
  { src: "bal.png", name: "bal.jpg" },
];

for (const j of jobs) {
  await sharp(path.join(root, j.src))
    .resize(640, 640, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, j.name));
  console.log("✓", j.src, "→ hero/" + j.name);
}
console.log("Bitti.");
