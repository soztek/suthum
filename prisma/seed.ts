import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  };
  return text
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type Seed = {
  name: string;
  desc: string;
  price: number;
  compareAt?: number;
  unit?: string;
  cold?: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: number;
};

const DATA: { cat: string; emoji: string; items: Seed[] }[] = [
  {
    cat: "Peynir Çeşitleri",
    emoji: "🧀",
    items: [
      { name: "Ardahan Eski Kaşar (1 Yıllık)", desc: "Şirden mayalı, bir yıl olgunlaştırılmış tam yağlı Ardahan kaşarı. Yoğun aroma, dilimlenebilir kıvam.", price: 620, compareAt: 720, unit: "500 GR", cold: true, featured: true, rating: 4.9, reviews: 214 },
      { name: "Ardahan Taze Kaşar", desc: "Günlük çiğ sütten, yumuşacık ve hafif tuzlu taze kaşar. Tost ve kahvaltının vazgeçilmezi.", price: 480, unit: "500 GR", cold: true, rating: 4.8, reviews: 156 },
      { name: "Çeçil (Civil) Peyniri", desc: "Tel tel açılan, düşük yağlı geleneksel çeçil peyniri. Örgü peynirin yöresel atası.", price: 380, unit: "250 GR", cold: true, rating: 4.7, reviews: 98 },
      { name: "Göravye (Gravyer) Peyniri", desc: "Peynirlerin şahı. Fındıksı tadı ve gözenekli dokusuyla Ardahan'ın imza lezzeti.", price: 560, unit: "400 GR", cold: true, featured: true, rating: 5.0, reviews: 187 },
      { name: "Otlu Lor Peyniri", desc: "Taze lor peynirine yayla otlarının katıldığı hafif ve besleyici lezzet.", price: 220, unit: "500 GR", cold: true, rating: 4.6, reviews: 74 },
      { name: "Koyun Tulum Peyniri", desc: "Deri tulumda olgunlaştırılmış, keskin aromalı koyun sütü peyniri.", price: 520, unit: "400 GR", cold: true, rating: 4.8, reviews: 121 },
    ],
  },
  {
    cat: "Bal Çeşitleri",
    emoji: "🍯",
    items: [
      { name: "Ardahan Kara Kovan Balı", desc: "Yılda bir kez hasat edilen, karakovanda doğal olgunlaşan yüksek rakım balı.", price: 950, unit: "850 GR", featured: true, rating: 5.0, reviews: 168 },
      { name: "Yayla Çiçek Balı (Süzme)", desc: "Ardahan yaylalarının binbir çiçeğinden süzme çiçek balı. Katkısız, doğal.", price: 620, unit: "850 GR", rating: 4.9, reviews: 203 },
      { name: "Petekli Süzme Bal", desc: "Peteğiyle birlikte sunulan, kristalleşmemiş taze bal.", price: 780, compareAt: 890, unit: "1 KG", rating: 4.8, reviews: 132 },
      { name: "Anzer Tipi Yüksek Rakım Balı", desc: "2500m rakımda toplanan, aromatik ve şifa deposu premium bal.", price: 1180, unit: "450 GR", rating: 5.0, reviews: 88 },
    ],
  },
  {
    cat: "Süt & Tereyağı",
    emoji: "🧈",
    items: [
      { name: "Köy Tereyağı (Mayıs Yağı)", desc: "İlkbahar otlarıyla beslenen ineklerin sütünden, kokusuyla fark yaratan mayıs tereyağı.", price: 540, compareAt: 620, unit: "1 KG", cold: true, featured: true, rating: 4.9, reviews: 245 },
      { name: "Sade Yağ (Eritilmiş Tereyağı)", desc: "Geleneksel yöntemle eritilmiş, uzun ömürlü hakiki sade yağ.", price: 720, unit: "1 KG", cold: true, rating: 4.8, reviews: 141 },
      { name: "Günlük Organik Çiğ Süt", desc: "Sabah sağılıp aynı gün soğuk zincirle gönderilen doğal çiğ süt.", price: 60, unit: "1 LT", cold: true, rating: 4.7, reviews: 67 },
      { name: "Ev Yapımı Süzme Yoğurt", desc: "Taş mayası ile mayalanmış, kaymağı yerinde kıvamlı köy yoğurdu.", price: 90, unit: "1 KG", cold: true, rating: 4.8, reviews: 112 },
    ],
  },
  {
    cat: "Et & Şarküteri",
    emoji: "🥩",
    items: [
      { name: "Ardahan Dana Kavurma", desc: "Kendi yağında pişirilmiş, kavanozda saklanan geleneksel dana kavurma.", price: 890, unit: "800 GR", cold: true, rating: 4.9, reviews: 154 },
      { name: "Kars Usulü Fermente Dana Sucuk", desc: "Baharatıyla dinlendirilmiş, doğal fermente hakiki dana sucuk.", price: 560, compareAt: 680, unit: "550 GR", cold: true, featured: true, rating: 4.9, reviews: 312 },
      { name: "Dana Pastırma (Çemenli)", desc: "İnce çemen tabakasıyla kaplanmış, kuruyemiş kıvamında kaliteli pastırma.", price: 980, unit: "500 GR", cold: true, rating: 4.8, reviews: 96 },
    ],
  },
  {
    cat: "Yöresel Ürünler",
    emoji: "🌾",
    items: [
      { name: "İspir Kuru Fasulyesi", desc: "Tanesi iri, kabuğu ince, çabuk pişen meşhur İspir fasulyesi.", price: 260, unit: "1 KG", rating: 4.7, reviews: 89 },
      { name: "Ardahan Ketesi (2'li)", desc: "El açması, tereyağlı yöresel kete. Kahvaltıya ve çaya eşlik eder.", price: 180, unit: "2 Adet", rating: 4.8, reviews: 76 },
      { name: "El Açması Erişte", desc: "Köy yumurtasıyla açılıp güneşte kurutulan geleneksel erişte.", price: 140, unit: "500 GR", rating: 4.6, reviews: 54 },
      { name: "Yayla Kış Çayı (Kuşburnu)", desc: "Yüksek rakım kuşburnu ve dağ çiçeklerinden doğal bitki çayı.", price: 120, unit: "150 GR", rating: 4.7, reviews: 61 },
      { name: "Kuşburnu Reçeli", desc: "Şeker oranı düşük, çekirdeği ayıklanmış ev yapımı kuşburnu reçeli.", price: 160, unit: "380 GR", rating: 4.8, reviews: 43 },
    ],
  },
  {
    cat: "Paketler",
    emoji: "🎁",
    items: [
      { name: "Ardahan Tanışma Paketi", desc: "Eski kaşar, çiçek balı, köy tereyağı ve ketenin bir arada olduğu başlangıç paketi.", price: 1450, compareAt: 1800, unit: "Paket", featured: true, rating: 4.9, reviews: 187 },
      { name: "Kahvaltı Sofrası Paketi", desc: "6 çeşit peynir, bal, tereyağı ve reçelle donatılmış zengin kahvaltı seti.", price: 2200, compareAt: 2700, unit: "Paket", featured: true, rating: 5.0, reviews: 231 },
      { name: "Ardahan Gurme Paketi", desc: "Kavurma, sucuk, pastırma, göravye ve karakovan balı ile en kapsamlı lezzet paketi.", price: 3800, compareAt: 4600, unit: "Paket", featured: true, rating: 5.0, reviews: 143 },
    ],
  },
];

async function main() {
  console.log("Seed başlıyor...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Ayarlar
  await prisma.setting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "SÜTHÜM",
      tagline: "Ardahan'ın Doğal Lezzetleri",
      phone: "+90 536 564 13 75",
      whatsapp: "905365641375",
      email: "info@suthum.com",
      instagram: "suthum",
      address: "Kubilay Bey Mah. Belediye Sok. No:5, Göle / ARDAHAN",
      freeShippingLimit: new Prisma.Decimal(3000),
      announcement: "₺3000 ve üzeri siparişlerde ÜCRETSİZ soğuk zincir kargo",
    },
  });

  let catOrder = 0;
  for (const group of DATA) {
    const category = await prisma.category.create({
      data: {
        name: group.cat,
        slug: slugify(group.cat),
        emoji: group.emoji,
        order: catOrder++,
      },
    });

    let pOrder = 0;
    for (const it of group.items) {
      await prisma.product.create({
        data: {
          name: it.name,
          slug: slugify(it.name),
          description: it.desc,
          price: new Prisma.Decimal(it.price),
          compareAt: it.compareAt ? new Prisma.Decimal(it.compareAt) : null,
          unit: it.unit,
          coldChain: it.cold ?? false,
          isFeatured: it.featured ?? false,
          rating: it.rating ?? 4.8,
          reviewCount: it.reviews ?? 0,
          stock: 100,
          order: pOrder++,
          categoryId: category.id,
        },
      });
    }
    console.log(`  ${group.emoji} ${group.cat}: ${group.items.length} ürün`);
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
