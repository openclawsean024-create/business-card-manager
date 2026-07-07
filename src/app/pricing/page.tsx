import Link from "next/link";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "定價",
  description: "名片王 Pro 訂閱方案。免費版 30 張、Pro 月費 NT$149 無限 + 雲端同步、Business NT$999 含 CRM 整合。",
};

export default function PricingPage() {
  return (
    <>
      <nav className="border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white font-bold">M</div>
            <span className="font-semibold tracking-tight">名片王 <span className="text-[var(--gold)]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-ghost text-sm">首頁</Link>
            <Link href="/register" className="btn-primary text-sm">免費開始</Link>
          </div>
        </div>
      </nav>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-medium text-[var(--accent-hover)] tracking-widest uppercase mb-3">PRICING</div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              簡單透明的<em className="font-[var(--font-display)] italic gradient-text">方案</em>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              從免費試用到企業版，隨時升級、隨時取消。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative card p-8 flex flex-col ${
                  plan.id === "pro" ? "border-[var(--accent)] shadow-md shadow-[var(--accent-soft)]" : ""
                }`}
              >
                {plan.id === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-xs font-medium">
                    最受歡迎
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-[var(--text-tertiary)]">{plan.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    {plan.price.monthly === 0 ? (
                      <span className="text-4xl font-bold">免費</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">NT${plan.price.monthly}</span>
                        <span className="text-[var(--text-tertiary)] text-sm">/月</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.id === "free" ? "/register" : `/checkout?plan=${plan.id}`}
                  className={plan.id === "pro" ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}
                >
                  {plan.id === "free" ? "免費開始" : `升級到 ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>

          {/* 比較表 */}
          <div className="mt-20">
            <h2 className="text-2xl font-semibold mb-8 text-center">功能比較</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-tertiary)]">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">功能</th>
                    {PLANS.map((p) => (
                      <th key={p.id} className="px-6 py-4 text-center font-medium">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <Row label="名片數量" values={["30", "無限", "無限"]} />
                  <Row label="本機儲存" values={["✓", "✓", "✓"]} highlight />
                  <Row label="雲端同步" values={["—", "✓", "✓"]} />
                  <Row label="Telegram 同步" values={["—", "✓", "✓"]} highlight />
                  <Row label="批次 vCard 匯入" values={["—", "✓", "✓"]} />
                  <Row label="AI 標籤建議" values={["—", "✓", "✓"]} highlight />
                  <Row label="5 帳號共享" values={["—", "—", "✓"]} />
                  <Row label="CRM 整合 (HubSpot/Salesforce)" values={["—", "—", "✓"]} highlight />
                  <Row label="API 接入" values={["—", "—", "✓"]} />
                  <Row label="客服支援" values={["社群", "Email", "優先 24hr"]} highlight />
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">訂閱常見問題</h2>
            <div className="space-y-4">
              <Faq q="可以隨時取消嗎？" a="可以，隨時取消訂閱，月底前不會再收費。已付費期間仍可使用。" />
              <Faq q="有免費試用嗎？" a="免費版永久 30 張名片，無需信用卡。" />
              <Faq q="可以升級或降級嗎？" a="可以，方案變更將在下個計費週期生效。" />
              <Faq q="支援哪些付款方式？" a="目前支援信用卡（Visa / MasterCard / JCB）透過 Stripe 金流。日後將加入 ATM 轉帳。" />
              <Faq q="企業版可開統編發票嗎？" a="可以，請聯絡 sales@card-pro.com 開立三聯式發票。" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border-subtle)] py-12">
        <div className="max-w-6xl mx-auto px-6 text-sm text-[var(--text-tertiary)] flex flex-col md:flex-row justify-between gap-3">
          <div>© 2026 名片王 Pro</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">隱私權</Link>
            <Link href="/terms" className="hover:text-white">使用條款</Link>
            <Link href="/contact" className="hover:text-white">聯絡</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function Row({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-[rgba(99,102,241,0.04)]" : ""}>
      <td className="px-6 py-4 text-[var(--text-secondary)]">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-6 py-4 text-center">{v}</td>
      ))}
    </tr>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="card p-5 cursor-pointer">
      <summary className="font-medium flex items-center justify-between">
        {q}
        <span className="text-[var(--text-tertiary)]">+</span>
      </summary>
      <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{a}</p>
    </details>
  );
}