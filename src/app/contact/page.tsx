"use client";

import { useActionState } from "react";
import Link from "next/link";
import { contactAction } from "./actions";

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(contactAction, null);

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

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">聯絡我們</h1>
          <p className="text-[var(--text-secondary)]">
            我們在 <strong>1-2 個工作天</strong> 內回覆（Email 客服，Pro 為主）
          </p>
        </div>

        <form action={formAction} className="card p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">姓名</label>
            <input id="name" name="name" required className="input" placeholder="王小明" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
            <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1.5">主旨</label>
            <select id="subject" name="subject" required className="input">
              <option value="">— 選擇問題類型 —</option>
              <option value="ocr">OCR 辨識問題</option>
              <option value="billing">訂閱 / 付款問題</option>
              <option value="feature">功能建議</option>
              <option value="bug">回報 Bug</option>
              <option value="business">企業版 / 團體授權</option>
              <option value="delete">申請刪除帳號</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1.5">訊息</label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              maxLength={2000}
              className="input"
              placeholder="請描述你的問題（越具體越好）..."
            />
            <div className="text-xs text-[var(--text-tertiary)] mt-1">最多 2000 字元</div>
          </div>

          {state?.error && (
            <div className="text-sm text-[var(--danger)] bg-[rgba(239,68,68,0.1)] px-3 py-2 rounded">{state.error}</div>
          )}
          {state?.success && (
            <div className="text-sm text-[var(--success)] bg-[rgba(16,185,129,0.1)] px-3 py-2 rounded">{state.success}</div>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
            {pending ? "送出中..." : "送出訊息"}
          </button>
        </form>

        <div className="mt-12 grid md:grid-cols-3 gap-4 text-sm">
          <ContactCard label="客服 Email" value="support@card-pro.com" href="mailto:support@card-pro.com" />
          <ContactCard label="業務 Email" value="sales@card-pro.com" href="mailto:sales@card-pro.com" />
          <ContactCard label="隱私權 Email" value="privacy@card-pro.com" href="mailto:privacy@card-pro.com" />
        </div>
      </section>
    </>
  );
}

function ContactCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} className="card p-4 block hover:border-[var(--border-strong)] transition-colors">
      <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{label}</div>
      <div className="font-medium text-[var(--accent-hover)]">{value}</div>
    </a>
  );
}