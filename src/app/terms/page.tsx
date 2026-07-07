import Link from "next/link";

export const metadata = { title: "使用條款" };

export default function TermsPage() {
  return (
    <ArticlePage title="使用條款" updated="2026-07-07">
      <Section title="1. 接受條款">
        <p>當你註冊、登入或使用名片王 Pro（"本服務"），即代表你同意本條款。如不同意，請停止使用。</p>
      </Section>

      <Section title="2. 帳號">
        <ul className="list-disc pl-5 space-y-2">
          <li>你必須提供真實的 Email，並對你的帳號行為負責。</li>
          <li>不可將帳號借給他人使用、不可自動化註冊大量帳號。</li>
          <li>密碼請妥善保管，遺失請透過 <Link href="/contact" className="underline">聯絡頁</Link> 重設。</li>
        </ul>
      </Section>

      <Section title="3. 訂閱與付款">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>免費版</strong>：永久 30 張名片、本機儲存。</li>
          <li><strong>Pro / Business</strong>：月費 NT$149 / 999，可隨時取消，下個計費週期生效。</li>
          <li>付款透過 Stripe 處理，我們不存取你的信用卡資料。</li>
          <li>價格不含營業稅，企業用戶可開立三聯式發票（請聯絡 sales@card-pro.com）。</li>
        </ul>
      </Section>

      <Section title="4. 用戶行為守則">
        <p>你同意不會：</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>上傳含他人個資的名片而無授權（例如偷拍他人名片）。</li>
          <li>用於非法目的（詐騙、跟蹤、騷擾）。</li>
          <li>嘗試破壞、干擾或反向工程本服務。</li>
          <li>大量自動化請求造成伺服器負擔（API rate limit: 100 req/min）。</li>
        </ul>
      </Section>

      <Section title="5. 智慧財產">
        <ul className="list-disc pl-5 space-y-2">
          <li>本服務的程式碼、設計、品牌屬於名片王 Pro。</li>
          <li><strong>你的名片資料 100% 屬於你</strong>，可隨時匯出、刪除。</li>
          <li>OCR 引擎 Tesseract.js 為 Apache 2.0 開源授權。</li>
        </ul>
      </Section>

      <Section title="6. 服務變更與終止">
        <ul className="list-disc pl-5 space-y-2">
          <li>我們保留變更功能、定價、停服務的權利，會提前 30 天通知。</li>
          <li>如你違反條款，我們可暫停或終止你的帳號。</li>
          <li>免費試用期內不滿意，隨時取消，無需理由。</li>
        </ul>
      </Section>

      <Section title="7. 免責聲明">
        <p>本服務以「現狀」提供。我們會盡力確保 OCR 準確率但<strong>不保證 100% 正確</strong>。重要資料建議人工核對確認。</p>
      </Section>

      <Section title="8. 準據法">
        <p>本條款適用中華民國法律。如有爭議，以台灣台北地方法院為第一審管轄法院。</p>
      </Section>

      <Section title="9. 聯絡">
        <p>問題請至 <Link href="/contact" className="underline">聯絡頁</Link> 或 <a href="mailto:legal@card-pro.com" className="underline">legal@card-pro.com</a>。</p>
      </Section>
    </ArticlePage>
  );
}

import { ArticlePage, Section } from "../_components/article";