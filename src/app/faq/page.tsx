import Link from "next/link";

export const metadata = { title: "常見問題 FAQ" };

const FAQS = [
  { q: "OCR 準確率如何？", a: "Tesseract.js v5 在繁中 + 英文混搭名片約 85-92%。我們加上信心分數顯示，建議你確認後再儲存。如要企業級 99% 準確率，可升級 Pro 開啟 Google Vision API。" },
  { q: "我的名片圖片會上傳到雲端嗎？", a: "不會。OCR 在瀏覽器端用 WebAssembly 執行，圖片從未離開你的裝置。雲端只儲存 OCR 識別後的文字欄位。" },
  { q: "可以離線使用嗎？", a: "可以。免費版完全離線（localStorage）。Pro 雲端同步需要網路連線。" },
  { q: "支援哪些語言？", a: "目前支援繁中、簡中、英文、日文、韓文。OCR 引擎支援任意 Tesseract 語言包。" },
  { q: "可以匯入 vCard 嗎？", a: "Pro 以上方案支援批次 vCard 匯入。免費版單張匯入。" },
  { q: "可以多人共享嗎？", a: "Business 方案支援 5 帳號共享。Pro 為個人版。" },
  { q: "退訂後資料怎麼辦？", a: "退訂後你仍可存取本機已下載的 vCard / CSV。雲端資料保留 30 天後永久刪除。" },
  { q: "有 API 嗎？", a: "Business 方案有 REST API（讀寫名片、查詢、批次操作）。詳見 API 文檔（日後上線）。" },
  { q: "Telegram 機器人怎麼設定？", a: "Pro 以上用戶可在『設定 → Telegram 整合』取得教學影片，3 分鐘完成。" },
  { q: "有手機 App 嗎？", a: "目前是 PWA 網頁應用，手機瀏覽器可「加到主畫面」當 App 用。iOS / Android 原生 App 在 2026 Q4 規劃中。" },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          常見問題
        </h1>
        <p className="text-[var(--text-secondary)]">找不到答案？<Link href="/contact" className="text-[var(--accent-hover)] underline">聯絡我們</Link></p>
      </div>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <details key={i} className="card p-5 cursor-pointer">
            <summary className="font-medium flex items-center justify-between">
              {f.q}
              <span className="text-[var(--text-tertiary)] text-lg">+</span>
            </summary>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/contact" className="btn-primary">還有問題？聯絡我們 →</Link>
      </div>
    </div>
  );
}