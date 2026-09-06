"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(1, "請輸入姓名").max(100),
  email: z.string().email("Email 格式錯誤"),
  subject: z.string().min(1, "請選擇主旨"),
  message: z.string().min(10, "訊息至少 10 字元").max(2000),
});

export interface ActionState {
  error?: string;
  success?: string;
}

export async function contactAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.contactMessage.create({ data: parsed.data });
    return { success: "訊息已送出！我們會在 1-2 個工作天內回覆。" };
  } catch {
    return { error: "送出失敗，請稍後再試或直接 Email 給 support@card-pro.com" };
  }
}