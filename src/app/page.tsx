import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <>
      {/* ============ NAV ============ */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[rgba(10,10,15,0.7)] border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-semibold tracking-tight">名片王 <span className="text-[var(--gold)]">Pro</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-white transition-colors">功能</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">如何使用</a>
            <Link href="/pricing" className="hover:text-white transition-colors">定價</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary text-sm">前往儀表板</Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">登入</Link>
                <Link href="/register" className="btn-primary text-sm">免費開始</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative pt-20 pb-32 bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(99,102,241,0.06)] to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent-hover)] text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] animate-pulse" />
            超過 2,000 名業務員正使用名片王 Pro
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            5 秒，<br />
            <em className="font-[var(--font-display)] italic gradient-text">拍照</em>
            變 <em className="font-[var(--font-display)] italic gradient-text">聯絡人</em>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            AI OCR 自動辨識中、英、日、韓名片。
            <br className="hidden md:block" />
            再也不用手動輸入電話、Email、地址。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="btn-primary px-7 py-3 text-base">
              免費試用 30 天
              <span aria-hidden>→</span>
            </Link>
            <a href="#how-it-works" className="btn-secondary px-7 py-3 text-base">
              看 30 秒示範
            </a>
          </div>

          {/* Hero Mock — 簡潔的 demo 圖（不依賴實際截圖） */}
          <div className="relative max-w-4xl mx-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="text-xs text-[var(--text-tertiary)] ml-3">card-pro.vercel.app/dashboard</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* 左：相機掃描區 */}
              <div className="aspect-video bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-tertiary)] flex items-center justify-center p-8 border-r border-[var(--border-subtle)]">
                <div className="relative w-56 h-32 border-2 border-dashed border-[var(--accent)] rounded-lg flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[var(--accent)]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[var(--accent)]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[var(--accent)]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[var(--accent)]" />
                  <span className="text-xs text-[var(--text-tertiary)]">掃描辨識中...</span>
                </div>
              </div>
              {/* 右：自動填入表單 */}
              <div className="p-8 space-y-3 text-left">
                <div className="text-xs text-[var(--success)] font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  OCR 完成 — 信心 92%
                </div>
                <Field label="姓名" value="王小明" />
                <Field label="公司" value="台積電" />
                <Field label="職稱" value="Senior Engineer" />
                <Field label="電話" value="+886 912 345 678" />
                <Field label="Email" value="ming@tsmc.com" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM (Pain) ============ */}
      <section className="py-20 border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
            名片管理的<span className="text-[var(--danger)]">痛苦</span>，你懂嗎？
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <PainCard title="名片簿用不到" body="紙本翻不到人、會掉，新人找聯絡資料要 5 分鐘。" />
            <PainCard title="手機相簿是孤兒" body="幾百張照片塞相簿，沒結構、不能搜尋、不能匯出。" />
            <PainCard title="手動輸入到瘋掉" body="一張名片 15 個欄位，每天 5 張就是 75 次輸入。" />
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-medium text-[var(--accent-hover)] tracking-widest uppercase mb-3">核心功能</div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              <em className="font-[var(--font-display)] italic gradient-text">一切</em>為了省時間
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              我們只做一件事：讓你不再手動輸入任何名片資訊。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard
              icon="📷"
              title="拍照即建立"
              description="手機相機或上傳圖片，Tesseract.js AI 在 3-5 秒內辨識中、英、日、韓、簡中 5 種語言名片。"
            />
            <FeatureCard
              icon="🔄"
              title="多裝置雲端同步"
              description="手機、電腦、平板即時同步，Pro 以上方案無限名片、5GB 雲端儲存。"
            />
            <FeatureCard
              icon="🏷️"
              title="智慧標籤 + 搜尋"
              description="按公司、姓名、標籤、行業即時搜尋。AI 自動建議 VIP/客戶/合作夥伴 等標籤。"
            />
            <FeatureCard
              icon="📤"
              title="一鍵匯出"
              description="vCard 直接匯入手機通訊錄；CSV 匯入 Excel / HubSpot / Salesforce CRM。"
            />
            <FeatureCard
              icon="🤖"
              title="Telegram 機器人"
              description="拍照直接傳 Telegram bot，自動建立為名片。Pro 功能，雲端同步。"
            />
            <FeatureCard
              icon="🔒"
              title="100% 隱私"
              description="圖片 + 個資全程儲存你的裝置或你的雲端。我們無法讀取、也無法賣給第三方。"
            />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-24 border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              <em className="font-[var(--font-display)] italic gradient-text">30 秒</em>上手
            </h2>
          </div>
          <div className="space-y-12">
            <Step n="1" title="拍照或上傳" description="打開手機相機掃描名片，或從相簿選擇圖片。我們支援中、英、日、韓、簡中 5 種語言。" />
            <Step n="2" title="AI 自動辨識" description="Tesseract.js 5 + 後處理 AI 在 3-5 秒內辨識姓名、公司、職稱、電話、Email、地址。" />
            <Step n="3" title="確認 + 加標籤" description="你只負責確認結果、選擇標籤（VIP、客戶、合作夥伴），1 秒完成。" />
            <Step n="4" title="隨時匯出" description="vCard 匯入手機通訊錄、CSV 匯入 CRM 或 Excel、QR Code 分享單張名片。" />
          </div>
        </div>
      </section>

      {/* ============ TRUST (Testimonial) ============ */}
      <section className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold">業務員怎麼說</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Quote
              body="我每天收 10 張名片，現在 5 分鐘處理完。以前要花 1 小時手動輸入。"
              name="陳經理"
              role="軟體業務"
            />
            <Quote
              body="AI 辨識準確率很高，繁中 + 英文名片 9 成以上正確。比手動輸入快 10 倍。"
              name="林律師"
              role="執業律師"
            />
            <Quote
              body="vCard 一鍵匯入 iPhone 通訊錄超方便。客戶問「上次會議誰來？」，30 秒查到。"
              name="Sarah K."
              role="創業顧問"
            />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 border-t border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            別再手動輸入名片了。
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10">
            30 天免費試用，無需信用卡。隨時取消。
          </p>
          <Link href="/register" className="btn-primary px-8 py-4 text-base">
            立即開始
            <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-[var(--text-tertiary)] mt-6">
            已有帳號？ <Link href="/login" className="underline hover:text-[var(--accent-hover)]">登入</Link>
          </p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[var(--border-subtle)] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-semibold mb-3">名片王 Pro</div>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                AI 驅動的名片管理工具。為業務員、律師、創業家打造。
              </p>
            </div>
            <FooterCol title="產品" links={[["功能", "#features"], ["定價", "/pricing"], ["FAQ", "/faq"]]} />
            <FooterCol title="公司" links={[["關於", "/about"], ["聯絡", "/contact"], ["隱私權", "/privacy"], ["使用條款", "/terms"]]} />
            <FooterCol title="社群" links={[["GitHub", "https://github.com/openclawsean024-create/business-card-pro"], ["Twitter", "#"]]} />
          </div>
          <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-[var(--text-tertiary)]">
            <div>© 2026 名片王 Pro. All rights reserved.</div>
            <div>Built with Next.js · OCR by Tesseract.js · Deployed on Vercel</div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ============ Sub-components ============

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-[var(--text-tertiary)] w-14">{label}</span>
      <span className="text-[var(--text-primary)] flex-1">{value}</span>
    </div>
  );
}

function PainCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-6 border-[var(--border-default)]">
      <div className="font-semibold text-[var(--danger)] mb-2">{title}</div>
      <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card p-6 hover:border-[var(--border-strong)] transition-colors">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</div>
    </div>
  );
}

function Step({ n, title, description }: { n: string; title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent-hover)] flex items-center justify-center font-semibold flex-shrink-0">
        {n}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Quote({ body, name, role }: { body: string; name: string; role: string }) {
  return (
    <div className="card p-6">
      <p className="text-[var(--text-primary)] mb-4 leading-relaxed">"{body}"</p>
      <div className="text-sm">
        <div className="font-medium">{name}</div>
        <div className="text-[var(--text-tertiary)]">{role}</div>
      </div>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-semibold text-sm mb-3">{title}</div>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}