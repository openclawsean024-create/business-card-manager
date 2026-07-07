import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "升級方案" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const planId = (params.plan ?? "pro") as "pro" | "business";
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) redirect("/pricing");

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

      <section className="max-w-2xl mx-auto px-6 py-16">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="text-xs text-[var(--accent-hover)] tracking-widest uppercase mb-2">CHECKOUT</div>
            <h1 className="text-3xl font-semibold mb-2">{plan.name} 訂閱</h1>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl font-bold">NT${plan.price.monthly}</span>
              <span className="text-[var(--text-tertiary)]">/月</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{plan.tagline}</p>
          </div>

          <ul className="space-y-2 mb-8">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-4 mb-6 text-sm">
            <div className="font-medium mb-2">🔧 金流串接中</div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              信用卡金流 (Stripe) 預計 <strong className="text-[var(--text-primary)]">2026 Q4 上線</strong>。
              目前可透過 Email <a href="mailto:sales@card-pro.com" className="text-[var(--accent-hover)] underline">sales@card-pro.com</a> 申請人工匯款（提供匯款帳號 + 統編發票）。
            </p>
          </div>

          <Link href="/dashboard" className="btn-secondary w-full justify-center">
            先免費試用
          </Link>

          <p className="text-xs text-[var(--text-tertiary)] text-center mt-6">
            金流問題？<Link href="/contact" className="underline">聯絡客服</Link>
          </p>
        </div>
      </section>
    </>
  );
}