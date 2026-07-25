import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cand = "C:/Users/OLGUNE~1/AppData/Local/Temp/claude/C--Users-Olgun-Ersin-Desktop-CLAUDE-CODE-QRMENU/26073c79-3c75-435f-a899-030ca29a653e/scratchpad/hero-cand";
const out = path.join(root, "public", "hero");

const jobs = [
  { src: "kasar_b.jpg", name: "kasar.jpg" },
  { src: "bal.jpg", name: "bal.jpg" },
  { src: "sut_a.jpg", name: "sut.jpg" },
  { src: "kavurma.jpg", name: "kavurma.jpg" },
];

await fs.mkdir(out, { recursive: true });

for (const j of jobs) {
  await sharp(path.join(cand, j.src))
    .resize(640, 640, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, j.name));
  console.log("✓", j.name);
}
console.log("Bitti: public/hero/");
