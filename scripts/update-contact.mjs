import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

await prisma.setting.update({
  where: { id: "main" },
  data: {
    phone: "+90 536 564 13 75",
    whatsapp: "905365641375",
    email: "info@suthum.com",
    address: "Kubilay Bey Mah. Belediye Sok. No:5, Göle / ARDAHAN",
  },
});

const s = await prisma.setting.findUnique({ where: { id: "main" } });
console.log("Güncellendi:", { phone: s.phone, whatsapp: s.whatsapp, email: s.email, address: s.address });
await prisma.$disconnect();
