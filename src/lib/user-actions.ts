"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "./prisma";
import {
  hashPassword,
  verifyPassword,
  createUserSession,
  destroyUserSession,
} from "./user-auth";

const registerSchema = z.object({
  name: z.string().min(2, "Ad soyad gerekli"),
  email: z.string().email("Geçerli e-posta girin"),
  phone: z.string().optional(),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export async function registerAction(_prev: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form hatalı" };
  }
  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { error: "Bu e-posta ile zaten bir üyelik var. Giriş yapın." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash: await hashPassword(password),
    },
  });

  await createUserSession(user.id);
  redirect("/hesabim");
}

const loginSchema = z.object({
  email: z.string().email("Geçerli e-posta girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

export async function userLoginAction(_prev: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form hatalı" };
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await createUserSession(user.id);
  redirect("/hesabim");
}

export async function userLogoutAction() {
  await destroyUserSession();
  redirect("/");
}
