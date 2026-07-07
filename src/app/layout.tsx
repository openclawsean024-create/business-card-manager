import type { Metadata } from "next";
import { Inter, Instrument_Serif, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["300","400","500","700"], variable: "--font-noto-tc" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal","italic"], variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "名片王 Pro — AI 名片管理，5 秒建立聯絡人",
    template: "%s · 名片王 Pro",
  },
  description: "拍照 → AI OCR → 自動建立聯絡人。支援中文、英文、日文、韓文名片辨識。多裝置雲端同步、vCard 匯出、QR Code 分享。",
  keywords: ["名片管理", "名片 OCR", "business card OCR", "vCard", "AI 名片", "CRM 客戶管理"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "名片王 Pro — 5 秒 OCR 建立聯絡人",
    description: "AI 名片辨識，雲端同步，30 天免費試用。",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoTC.variable} ${display.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}