import Link from "next/link";

export const metadata = { title: "隱私權聲明" };

export default function PrivacyPage() {
  return (
    <ArticlePage title="隱私權聲明" updated="2026-07-07">
      <Section title="1. 我們蒐集什麼資料">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>帳號資料</strong>：註冊時提供之姓名、Email、密碼（加密儲存）。</li>
          <li><strong>名片資料</strong>：你主動上傳或手動新增之名片資訊（姓名、公司、職稱、電話、Email、地址等）。</li>
          <li><strong>OCR 圖片</strong>：你拍照或上傳之名片圖片。我們在瀏覽器端用 Tesseract.js 進行 OCR，<strong>圖片不會上傳到我們的伺服器</strong>。</li>
          <li><strong>付款資料</strong>：訂閱 Pro / Business 方案時，你會透過 Stripe 提供付款資料。我們<strong>不會</strong>存取你的信用卡號。</li>
          <li><strong>使用記錄</strong>：你的功能使用頻率（用於改善產品，不含個資）。</li>
        </ul>
      </Section>

      <Section title="2. 我們如何使用你的資料">
        <p>你的資料<strong>只</strong>用於：</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>提供名片管理、搜尋、匯出等核心功能。</li>
          <li>同步你的多裝置資料（僅限 Pro / Business 方案，雲端同步功能）。</li>
          <li>客服回覆（當你聯絡我們時）。</li>
        </ul>
        <p>我們<strong>不會</strong>：</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>出售或出租你的個資給任何第三方。</li>
          <li>用你的名片資料訓練 AI 模型。</li>
          <li>未經你同意發送任何行銷信件。</li>
        </ul>
      </Section>

      <Section title="3. 資料儲存與安全">
        <ul className="list-disc pl-5 space-y-2">
          <li>資料儲存於 Neon Postgres（雲端 PostgreSQL）並全程使用 TLS 加密傳輸。</li>
          <li>密碼以 bcrypt 雜湊（cost factor 12）儲存，無法反向解碼。</li>
          <li>所有 API 端點需通過 JWT session 認證。</li>
          <li>免費版用戶可隨時刪除帳號，30 天後永久刪除所有資料。</li>
        </ul>
      </Section>

      <Section title="4. 你的權利（GDPR / CCPA / 台灣個資法）">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>查詢 / 匯出</strong>：隨時從儀表板匯出你的所有名片資料（vCard / CSV 格式）。</li>
          <li><strong>修改</strong>：隨時編輯、刪除任一名片。</li>
          <li><strong>刪除帳號</strong>：至 <Link href="/contact" className="underline">聯絡頁</Link> 申請，30 天內永久刪除所有資料。</li>
          <li><strong>退訂行銷信</strong>：每封信底部都有「取消訂閱」連結。</li>
        </ul>
      </Section>

      <Section title="5. 聯絡">
        <p>關於隱私權的任何問題，請聯絡 <a href="mailto:privacy@card-pro.com" className="underline">privacy@card-pro.com</a>，我們會在 7 個工作天內回覆。</p>
      </Section>
    </ArticlePage>
  );
}

import { ArticlePage, Section } from "../_components/article";