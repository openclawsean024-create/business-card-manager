"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

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
            <h1 className="text-3xl font-semibold tracking-tight mb-2">歡迎回來</h1>
            <p className="text-[var(--text-secondary)] text-sm">登入繼續管理你的名片</p>
          </div>

          <form action={formAction} className="card p-6 space-y-4">
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
                autoComplete="current-password"
                placeholder="至少 8 個字元"
                className="input"
              />
            </div>

            {state?.error && (
              <div className="text-sm text-[var(--danger)] bg-[rgba(239,68,68,0.1)] px-3 py-2 rounded">
                {state.error}
              </div>
            )}

            <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
              {pending ? "登入中..." : "登入"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            還沒有帳號？{" "}
            <Link href="/register" className="text-[var(--accent-hover)] hover:underline">免費註冊</Link>
          </p>
        </div>
      </div>
    </>
  );
}