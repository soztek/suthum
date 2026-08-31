"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { checkCredentials, createSession, destroySession, isAuthed } from "./auth";
import { slugify } from "./utils";

async function guard() {
  if (!(await isAuthed())) throw new Error("Yetkisiz");
}

function dec(v: FormDataEntryValue | null): Prisma.Decimal | null {
  if (v === null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return isNaN(n) ? null : new Prisma.Decimal(n.toFixed(2));
}

// --- Kimlik ---
export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!checkCredentials(email, password)) {
    return { error: "E-posta veya şifre hatalı." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// --- Ürünler ---
export async function saveProduct(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  if (!name || !categoryId) throw new Error("Ad ve kategori zorunlu");

  const baseSlug = slugify(name);
  const price = dec(formData.get("price")) ?? new Prisma.Decimal(0);

  // Çoklu görsel: JSON dizisi. İlk görsel kapak (imageUrl) olur.
  let images: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("images") || "[]"));
    if (Array.isArray(parsed)) images = parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    images = [];
  }

  const data = {
    name,
    description: String(formData.get("description") || "") || null,
    price,
    compareAt: dec(formData.get("compareAt")),
    unit: String(formData.get("unit") || "") || null,
    imageUrl: images[0] ?? null,
    images,
    stock: Number(formData.get("stock") || 100),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    coldChain: formData.get("coldChain") === "on",
    categoryId,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    // benzersiz slug
    let slug = baseSlug;
    let n = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++n}`;
    }
    await prisma.product.create({ data: { ...data, slug } });
  }

  revalidatePath("/admin/urunler");
  revalidatePath("/");
  redirect("/admin/urunler");
}

export async function duplicateProduct(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const src = await prisma.product.findUnique({ where: { id } });
  if (!src) return;

  const name = `${src.name} (Kopya)`;
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const copy = await prisma.product.create({
    data: {
      name,
      slug,
      description: src.description,
      price: src.price,
      compareAt: src.compareAt,
      unit: src.unit,
      imageUrl: src.imageUrl,
      images: src.images,
      stock: src.stock,
      isActive: false, // kopya taslak olarak pasif başlar
      isFeatured: src.isFeatured,
      coldChain: src.coldChain,
      order: src.order,
      categoryId: src.categoryId,
    },
  });

  revalidatePath("/admin/urunler");
  redirect(`/admin/urunler/${copy.id}`);
}

export async function deleteProduct(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  if (id) await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/urunler");
  revalidatePath("/");
}

export async function toggleProductActive(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const p = await prisma.product.findUnique({ where: { id } });
  if (p) await prisma.product.update({ where: { id }, data: { isActive: !p.isActive } });
  revalidatePath("/admin/urunler");
  revalidatePath("/");
}

// --- Kategoriler ---
export async function saveCategory(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Kategori adı zorunlu");
  const emoji = String(formData.get("emoji") || "") || null;
  const imageUrl = String(formData.get("imageUrl") || "") || null;
  const order = Number(formData.get("order") || 0);

  if (id) {
    await prisma.category.update({ where: { id }, data: { name, emoji, imageUrl, order } });
  } else {
    let slug = slugify(name);
    let n = 1;
    while (await prisma.category.findUnique({ where: { slug } })) slug = `${slugify(name)}-${++n}`;
    await prisma.category.create({ data: { name, slug, emoji, imageUrl, order } });
  }
  revalidatePath("/admin/kategoriler");
  revalidatePath("/");
  redirect("/admin/kategoriler?ok=1");
}

export async function deleteCategory(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  if (id) await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategoriler");
  revalidatePath("/");
}

// --- Siparişler ---
export async function updateOrderStatus(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as
    | "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  if (id && status) {
    await prisma.order.update({ where: { id }, data: { status } });
  }
  revalidatePath("/admin/siparisler");
}

export async function markOrderPaid(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  if (id) {
    await prisma.order.update({
      where: { id },
      data: { paymentStatus: "PAID", status: "PREPARING" },
    });
  }
  revalidatePath("/admin/siparisler");
}

// --- Ayarlar ---
export async function saveSettings(formData: FormData) {
  await guard();
  await prisma.setting.update({
    where: { id: "main" },
    data: {
      siteName: String(formData.get("siteName") || "SÜTHÜM"),
      tagline: String(formData.get("tagline") || ""),
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      email: String(formData.get("email") || ""),
      instagram: String(formData.get("instagram") || ""),
      address: String(formData.get("address") || ""),
      heroTitle: String(formData.get("heroTitle") || ""),
      heroSubtitle: String(formData.get("heroSubtitle") || ""),
      announcement: String(formData.get("announcement") || ""),
      freeShippingLimit: dec(formData.get("freeShippingLimit")) ?? new Prisma.Decimal(2000),
      shippingFee: dec(formData.get("shippingFee")) ?? new Prisma.Decimal(89.9),
    },
  });
  revalidatePath("/", "layout");
  redirect("/admin/ayarlar?ok=1");
}
