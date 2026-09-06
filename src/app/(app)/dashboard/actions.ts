"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/auth";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return (session.user as { id: string }).id;
}

interface ActionResult {
  ok?: boolean;
  error?: string;
}

// ============ 建立名片 — 接 FormData ============
export async function createCardAction(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await requireUserId();

    // Plan 限制
    const sub = await db.subscription.findUnique({ where: { userId } });
    if (sub?.plan === "free") {
      const count = await db.businessCard.count({ where: { userId } });
      if (count >= 30) {
        return { error: "已達免費版上限（30 張）。請升級到 Pro 無限名片。" };
      }
    }

    const tagsRaw = formData.get("tags")?.toString() || "[]";
    let tags: string[] = [];
    try { tags = JSON.parse(tagsRaw); } catch { tags = []; }

    await db.businessCard.create({
      data: {
        userId,
        name: formData.get("name")?.toString() || null,
        company: formData.get("company")?.toString() || null,
        jobTitle: formData.get("jobTitle")?.toString() || null,
        phone: formData.get("phone")?.toString() || null,
        email: formData.get("email")?.toString() || null,
        address: formData.get("address")?.toString() || null,
        website: formData.get("website")?.toString() || null,
        notes: formData.get("notes")?.toString() || null,
        tags: JSON.stringify(tags),
        source: "manual",
      },
    });

    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e: unknown) {
    console.error("createCardAction error:", e);
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return { error: "請先登入" };
    }
    const msg = e instanceof Error ? e.message : "建立名片失敗";
    return { error: msg };
  }
}

// ============ 刪除名片 — 接 FormData ============
export async function deleteCardAction(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const id = formData.get("id")?.toString();
    if (!id) return { error: "缺少 id" };

    await db.businessCard.delete({
      where: { id, userId },
    });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "P2025") {
      return { error: "名片不存在或無權限" };
    }
    console.error("deleteCardAction error:", e);
    const msg = e instanceof Error ? e.message : "刪除失敗";
    return { error: msg };
  }
}