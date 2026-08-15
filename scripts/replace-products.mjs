import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(t) {
  const m = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", "–": "-", "—": "-" };
  return t.toLowerCase().replace(/[çğıöşü–—]/g, (c) => m[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

// [name, unit, desc, catSlug, price, featured]
const P = "peynir-cesitleri", K = "sut-tereyagi", Y = "yoresel-urunler", B = "bal-cesitleri";
const DATA = [
  ["Eski Kaşar", "1 KG", "Ardahan'ın Göle ilçesinde yüksek rakımlı ve zengin bitki örtüsüne sahip yaylalarında üretilen, kendine özgü aroması ve yoğun lezzetiyle öne çıkan geleneksel bir peynirdir.", P, 550, true],
  ["Olgun Açık Kaşar", "1.8–2 KG", "Göle'nin doğal yaylalarında yetişen hayvanların sütünden üretilen, geleneksel yöntemlerle olgunlaştırılan özel bir peynirdir.", P, 1000, true],
  ["Göbek Kaşar (1 KG)", "1 KG", "Ortalama 12-13 kg sütten elde edilen peynirin ortasındaki, kendine özgü yuvarlak 'göbek' kısmından alınan geleneksel yöntemlerle üretilen özel bir kaşar peyniridir.", P, 500, false],
  ["Blok (Tostluk) Kaşar", "1 KG", "Kolay eriyen, tost ve sıcak sandviçlerde kullanıma uygun blok kaşar.", P, 500, false],
  ["Gravyer", "500 GR", "Kendine özgü gözenekli yapısı ve belirgin aroması bulunan olgun peynir.", P, 550, true],
  ["Göbek Kaşar (500 GR)", "500 GR", "Kaşar kalıbının göbek kısmından sunulan, dolgun lezzetli peynir.", P, 300, false],
  ["Blok Kaşar (500 GR)", "500 GR", "Dilimlemeye ve günlük kullanıma uygun blok biçiminde kaşar peyniri.", P, 300, false],
  ["Köy Tipi Beyaz Peynir", "10 KG", "Geleneksel köy tipi üretim karakterine sahip salamuralı beyaz peynir.", P, 375, false],
  ["Dil Peyniri", "500 GR", "Lifli yapısı ve hafif lezzetiyle kahvaltıya uygun peynir.", P, 300, false],
  ["Örgü Peynir", "500 GR", "Örgü biçiminde hazırlanmış, lifli dokulu yöresel peynir.", P, 300, false],
  ["Köy Tereyağı (1 KG)", "1 KG", "Geleneksel köy tipi, kahvaltı ve yemeklerde kullanıma uygun tereyağı.", K, 650, true],
  ["Köy Tereyağı (5 KG)", "5 KG", "Geleneksel köy tipi, kahvaltı ve yemeklerde kullanıma uygun tereyağı.", K, 3000, false],
  ["Köy Tereyağı (10 KG)", "10 KG", "Geleneksel köy tipi, kahvaltı ve yemeklerde kullanıma uygun tereyağı.", K, 6000, false],
  ["Göğermiş Çeçil", "1 KG", "Olgunlaştırılarak göğertilmiş, lifli yapılı ve yoğun aromalı çeçil peyniri.", P, 400, false],
  ["Dökme Beyaz Çeçil", "1 KG", "Dökme olarak sunulan, beyaz renkli ve lifli dokulu çeçil peyniri.", P, 375, false],
  ["Koyun-Keçi Tulum Peyniri", "1 KG", "Koyun ve keçi sütü karakterini taşıyan, yoğun aromalı tulum peyniri.", P, 650, true],
  ["Dökme Tulum Peyniri", "1 KG", "Dökme olarak sunulan, ufalanabilir dokulu ve belirgin aromalı tulum peyniri.", P, 375, false],
  ["Zeytin", "1 KG", "Sofralık zeytin; çeşit ve salamura bilgisi gerektiğinde eklenebilir.", Y, 375, false],
  ["Süzme Çiçek Balı", "900 GR", "Bölgenin yüksek rakımlı yaylalarında elde edilen, doğal aroması ve kendine özgü yoğun lezzetiyle öne çıkan yöresel bir baldır.", B, 1000, true],
  ["Pekmez", "1 KG", "Geleneksel yöntemlerle yoğunlaştırılmış yöresel pekmez.", Y, 600, false],
  ["Köy Pestili", "500 GR", "Meyve özünden hazırlanan, ince serilip kurutulmuş geleneksel köy pestili.", Y, 250, false],
  ["Köme (Cevizli Sucuk)", "500 GR", "Cevizlerin meyve şıralı karışımla kaplanmasıyla hazırlanan yöresel tatlı.", Y, 250, true],
  ["Aşma", "1 KG", "Yöresel ürün; içerik ve ürün özelliği gerektiğinde güncellenebilir.", Y, 400, false],
  ["Tamas", "1 KG", "Yöresel ürün; içerik ve ürün özelliği gerektiğinde güncellenebilir.", Y, 400, false],
  ["Kızılcık Kurusu", "1 KG", "Kurutulmuş kızılcık meyvesi; atıştırmalık veya tariflerde kullanıma uygun.", Y, 350, false],
  ["Helva", "850 GR", "Geleneksel tatlı; çeşidi ve içerik bilgisi gerektiğinde eklenebilir.", Y, 400, false],
  ["Muska Tatlı", "500 GR", "Muska biçiminde hazırlanmış, yöresel dolgulu tatlı.", Y, 350, false],
  ["Rulo Fındık Ezmesi Tatlı", "500 GR", "Fındık ezmeli dolgu ile rulo biçiminde hazırlanmış yöresel tatlı.", Y, 350, false],
];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function main() {
  // 1) Kategori adı düzelt + boş kategorileri gizle
  await prisma.category.updateMany({ where: { slug: "sut-tereyagi" }, data: { name: "Kaymak & Tereyağı" } });
  await prisma.category.updateMany({ where: { slug: { in: ["et-sarkuteri", "paketler"] } }, data: { isActive: false } });

  const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // 2) Eski örnek ürünleri SİLME — sadece gizle (geri alınabilir)
  await prisma.product.updateMany({ data: { isActive: false } });

  // 3) Yeni ürünleri ekle
  let order = 0;
  const seen = new Set();
  for (const [name, unit, desc, catSlug, price, featured] of DATA) {
    let slug = slugify(`${name} ${unit}`);
    while (seen.has(slug)) slug = `${slug}-x`;
    seen.add(slug);
    const cold = catSlug === P || catSlug === K;
    await prisma.product.create({
      data: {
        name, slug, description: desc, unit,
        price: new Prisma.Decimal(price),
        categoryId: catId[catSlug],
        isFeatured: !!featured,
        coldChain: cold,
        rating: 4.8 + Math.random() * 0.2,
        reviewCount: rnd(8, 120),
        stock: 100,
        order: order++,
      },
    });
  }
  console.log(`${DATA.length} ürün yüklendi.`);
  const counts = await prisma.category.findMany({
    where: { isActive: true }, orderBy: { order: "asc" },
    select: { name: true, _count: { select: { products: true } } },
  });
  for (const c of counts) console.log(`  ${c.name}: ${c._count.products} ürün`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
