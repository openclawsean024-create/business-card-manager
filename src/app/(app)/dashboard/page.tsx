import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "../../(auth)/actions";
import { PLANS } from "@/lib/plans";
import CardList from "./card-list";

export const metadata = { title: "儀表板" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id as string;
  const [cards, sub] = await Promise.all([
    db.businessCard.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.subscription.findUnique({ where: { userId } }),
  ]);

  const plan = (sub?.plan ?? "free") as "free" | "pro" | "business";
  const planInfo = PLANS.find((p) => p.id === plan)!;
  const totalCount = await db.businessCard.count({ where: { userId } });

  // 解析 tags (儲存為 JSON string)
  const parsedCards = cards.map((c) => ({
    ...c,
    tags: (() => {
      try { return JSON.parse(c.tags); } catch { return []; }
    })() as string[],
  }));

  return (
    <>
      {/* NAV */}
      <nav className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white font-bold">M</div>
            <span className="font-semibold tracking-tight">名片王 <span className="text-[var(--gold)]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[var(--text-secondary)]">
              {session.user.email}
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              plan === "free" ? "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]" :
              plan === "pro" ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]" :
              "bg-[var(--gold-soft)] text-[var(--gold)]"
            }`}>
              {planInfo.name}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="btn-ghost text-sm">登出</button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="名片總數" value={String(totalCount)} hint={
            plan === "free" ? `${totalCount} / 30` : "無限"
          } />
          <Stat label="方案" value={planInfo.name} />
          <Stat label="本月新增" value={String(cards.length > 0 ? new Set(cards.map(c => new Date(c.createdAt).toISOString().slice(0,7))).size : 0)} />
          <Stat
            label="雲端同步"
            value={planInfo.limits.cloudSync ? "已開啟" : "未開啟"}
            accent={planInfo.limits.cloudSync ? "success" : "muted"}
          />
        </div>

        {/* Upgrade CTA if Free */}
        {plan === "free" && totalCount >= 20 && (
          <div className="card p-5 mb-6 border-[var(--gold)] bg-[var(--gold-soft)]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-semibold text-[var(--gold)] mb-1">你已收集 {totalCount} 張名片，快接近上限了</div>
                <div className="text-sm text-[var(--text-secondary)]">升級到 Pro 解鎖無限名片 + 雲端同步 + Telegram 機器人。</div>
              </div>
              <Link href="/pricing" className="btn-primary">查看方案 →</Link>
            </div>
          </div>
        )}

        {/* Card list */}
        <CardList initialCards={parsedCards} plan={plan} />
      </main>
    </>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: "success" | "muted" }) {
  return (
    <div className="card p-5">
      <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-semibold ${
        accent === "success" ? "text-[var(--success)]" : ""
      }`}>{value}</div>
      {hint && <div className="text-xs text-[var(--text-tertiary)] mt-1">{hint}</div>}
    </div>
  );
}