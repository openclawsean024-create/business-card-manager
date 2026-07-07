"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const cardSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user as { id: string };
}

export async function createCardAction(data: z.infer<typeof cardSchema>) {
  const user = await requireUser();
  const parsed = cardSchema.parse(data);

  // 檢查 plan 限制
  const sub = await db.subscription.findUnique({ where: { userId: user.id } });
  if (sub?.plan === "free") {
    const count = await db.businessCard.count({ where: { userId: user.id } });
    if (count >= 30) {
      throw new Error("已達免費版上限（30 張）。請升級到 Pro 無限名片。");
    }
  }

  await db.businessCard.create({
    data: {
      userId: user.id,
      ...parsed,
      tags: JSON.stringify(parsed.tags),
      source: "manual",
    },
  });
  revalidatePath("/dashboard");
}

export async function deleteCardAction(id: string) {
  const user = await requireUser();
  await db.businessCard.delete({
    where: { id, userId: user.id },
  });
  revalidatePath("/dashboard");
}

export async function updateCardAction(id: string, data: z.infer<typeof cardSchema>) {
  const user = await requireUser();
  const parsed = cardSchema.parse(data);
  await db.businessCard.update({
    where: { id, userId: user.id },
    data: {
      ...parsed,
      tags: JSON.stringify(parsed.tags),
    },
  });
  revalidatePath("/dashboard");
}