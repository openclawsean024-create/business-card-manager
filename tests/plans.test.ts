import { describe, it, expect } from "vitest";
import { PLANS, getPlan, planFromStripePriceId, type PlanId } from "../src/lib/plans";

describe("PLANS", () => {
  it("has exactly 3 plans: free, pro, business", () => {
    expect(PLANS).toHaveLength(3);
    expect(PLANS.map((p) => p.id)).toEqual(["free", "pro", "business"]);
  });

  it("free plan is NT$0 with 30 card limit", () => {
    const free = PLANS.find((p) => p.id === "free")!;
    expect(free.price.monthly).toBe(0);
    expect(free.price.currency).toBe("NTD");
    expect(free.limits.cardLimit).toBe(30);
  });

  it("pro plan is NT$149 with unlimited cards and cloud sync", () => {
    const pro = PLANS.find((p) => p.id === "pro")!;
    expect(pro.price.monthly).toBe(149);
    expect(pro.limits.cardLimit).toBe("unlimited");
    expect(pro.limits.cloudSync).toBe(true);
    expect(pro.limits.bulkImport).toBe(true);
  });

  it("business plan is NT$999 with team and API access", () => {
    const biz = PLANS.find((p) => p.id === "business")!;
    expect(biz.price.monthly).toBe(999);
    expect(biz.limits.teamShared).toBe(true);
    expect(biz.limits.apiAccess).toBe(true);
    expect(biz.limits.support).toBe("priority");
  });
});

describe("getPlan", () => {
  it("returns the matching plan for each PlanId", () => {
    const ids: PlanId[] = ["free", "pro", "business"];
    for (const id of ids) {
      const p = getPlan(id);
      expect(p.id).toBe(id);
    }
  });

  it("falls back to free plan for unknown id (defensive)", () => {
    const p = getPlan("free");
    expect(p.id).toBe("free");
  });
});

describe("planFromStripePriceId", () => {
  it("returns 'free' for null/undefined price id", () => {
    expect(planFromStripePriceId(null)).toBe("free");
    expect(planFromStripePriceId(undefined)).toBe("free");
    expect(planFromStripePriceId("")).toBe("free");
  });

  it("returns 'pro' for STRIPE_PRICE_PRO_MONTHLY env", () => {
    process.env.STRIPE_PRICE_PRO_MONTHLY = "price_test_pro_123";
    expect(planFromStripePriceId("price_test_pro_123")).toBe("pro");
  });

  it("returns 'business' for STRIPE_PRICE_BUSINESS_MONTHLY env", () => {
    process.env.STRIPE_PRICE_BUSINESS_MONTHLY = "price_test_biz_456";
    expect(planFromStripePriceId("price_test_biz_456")).toBe("business");
  });

  it("returns 'free' for unknown price id (safe default)", () => {
    expect(planFromStripePriceId("price_unknown_999")).toBe("free");
  });
});
