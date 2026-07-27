"use client";

import Link from "next/link";
import { useActionState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { registerAction } from "@/lib/user-actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null);
  const input =
    "w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <div className="rounded-3xl border border-green-100 bg-white p-8 card-shadow">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
            <UserPlus size={22} />
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-ink">Üye Ol</h1>
          <p className="mt-1 text-sm text-ink/60">Siparişlerini takip et, daha hızlı alışveriş yap.</p>
        </div>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Ad Soyad *</label>
            <input name="name" required className={input} placeholder="Adınız Soyadınız" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">E-posta *</label>
            <input name="email" type="email" required className={input} placeholder="ornek@mail.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Telefon</label>
            <input name="phone" className={input} placeholder="05XX XXX XX XX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Şifre *</label>
            <input name="password" type="password" required minLength={6} className={input} placeholder="En az 6 karakter" />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">{state.error}</p>
          )}

          <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60">
            {pending ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            Üyeliğimi Oluştur
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/60">
          Zaten üye misin?{" "}
          <Link href="/giris" className="font-semibold text-green-700 hover:underline">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
