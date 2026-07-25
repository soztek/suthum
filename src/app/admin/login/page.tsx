"use client";

import { useActionState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { loginAction } from "@/lib/admin-actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-green-700 to-green-800 px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SÜT-HÜM" className="mx-auto h-24 w-auto" />
          <p className="mt-2 text-sm font-medium text-ink/50">Yönetim Paneli</p>
        </div>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">E-posta</label>
            <input name="email" type="email" required defaultValue="admin@suthum.com" className="w-full rounded-xl border border-green-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Şifre</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-green-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">{state.error}</p>
          )}

          <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60">
            {pending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
