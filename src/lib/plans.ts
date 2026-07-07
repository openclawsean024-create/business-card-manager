// 名片王 Pro — 訂閱方案定義
// 三層：Free / Pro NT$149 / Business NT$999
export type PlanId = "free" | "pro" | "business";

export interface PlanLimits {
  cardLimit: number | "unlimited";
  cloudSync: boolean;
  bulkImport: boolean;
  teamShared: boolean;
  apiAccess: boolean;
  support: "community" | "email" | "priority";
}

export interface Plan {
  id: PlanId;
  name: string;
  price: { monthly: number; currency: "NTD" };
  tagline: string;
  features: string[];
  limits: PlanLimits;
  stripePriceIdEnv?: string; // 對應 STRIPE_PRICE_PRO_MONTHLY 等
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "免費版",
    price: { monthly: 0, currency: "NTD" },
    tagline: "試試名片王，無需信用卡",
    features: [
      "30 張名片",
      "本機儲存（localStorage）",
      "OCR 中文 + 英文辨識",
      "vCard / CSV 匯出",
    ],
    limits: {
      cardLimit: 30,
      cloudSync: false,
      bulkImport: false,
      teamShared: false,
      apiAccess: false,
      support: "community",
    },
  },
  {
    id: "pro",
    name: "個人版",
    price: { monthly: 149, currency: "NTD" },
    tagline: "無限名片 + 雲端同步 + 多裝置",
    features: [
      "無限名片",
      "雲端同步（多裝置）",
      "Telegram 機器人同步",
      "批次匯入 vCard",
      "自動標籤建議",
      "Email 客服支援",
    ],
    limits: {
      cardLimit: "unlimited",
      cloudSync: true,
      bulkImport: true,
      teamShared: false,
      apiAccess: false,
      support: "email",
    },
    stripePriceIdEnv: "STRIPE_PRICE_PRO_MONTHLY",
  },
  {
    id: "business",
    name: "企業版",
    price: { monthly: 999, currency: "NTD" },
    tagline: "5 帳號共享 + CRM 整合 + API",
    features: [
      "5 個帳號共享",
      "HubSpot / Salesforce CRM 整合",
      "API 接入（REST）",
      "品牌客製（logo + 主色）",
      "優先客服（24hr 回覆）",
      "企業部署諮詢",
    ],
    limits: {
      cardLimit: "unlimited",
      cloudSync: true,
      bulkImport: true,
      teamShared: true,
      apiAccess: true,
      support: "priority",
    },
    stripePriceIdEnv: "STRIPE_PRICE_BUSINESS_MONTHLY",
  },
];

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

// 從 Stripe webhook 解析 plan 對應
export function planFromStripePriceId(priceId: string | null | undefined): PlanId {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY) return "business";
  return "free";
}