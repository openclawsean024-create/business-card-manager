"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "../actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <>
      <nav className="border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white font-bold">M</div>
            <span className="font-semibold tracking-tight">名片王 <span className="text-[var(--gold)]">Pro</span></span>
          </Link>
        </div>
      </nav>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">30 天免費試用</h1>
            <p className="text-[var(--text-secondary)] text-sm">免費版永久 30 張名片，無需信用卡</p>
          </div>

          <form action={formAction} className="card p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">姓名</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="王小明"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">密碼</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="至少 8 個字元"
                className="input"
              />
              <div className="text-xs text-[var(--text-tertiary)] mt-1.5">建議用大小寫 + 數字 + 符號</div>
            </div>

            <label className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <input type="checkbox" required className="mt-0.5" />
              <span>我同意 <Link href="/terms" className="text-[var(--accent-hover)] hover:underline">使用條款</Link> 與 <Link href="/privacy" className="text-[var(--accent-hover)] hover:underline">隱私權聲明</Link></span>
            </label>

            {state?.error && (
              <div className="text-sm text-[var(--danger)] bg-[rgba(239,68,68,0.1)] px-3 py-2 rounded">
                {state.error}
              </div>
            )}

            <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
              {pending ? "建立帳號中..." : "建立帳號"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            已有帳號？{" "}
            <Link href="/login" className="text-[var(--accent-hover)] hover:underline">登入</Link>
          </p>
        </div>
      </div>
    </>
  );
}