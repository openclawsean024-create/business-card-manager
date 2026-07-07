"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";

const registerSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.string().email("Email 格式錯誤"),
  password: z.string().min(8, "密碼至少 8 字元"),
});

const loginSchema = z.object({
  email: z.string().email("Email 格式錯誤"),
  password: z.string().min(1, "請輸入密碼"),
});

export interface ActionState {
  error?: string;
  success?: string;
}

export async function registerAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  // 檢查 Email 是否已註冊
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "這個 Email 已註冊，請直接登入" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      subscription: {
        create: { plan: "free", stripeStatus: "incomplete" },
      },
    },
  });

  // 自動登入 — signIn 內部會 throw 一個 NEXT_REDIRECT 信號來中斷執行 + 觸發 redirect
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return { success: "註冊成功" };
}

export async function loginAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (e: any) {
    // Auth.js v5 redirect 會 throw 一個特殊物件，不要 catch
    if (e?.digest?.startsWith?.("NEXT_REDIRECT") || e?.message === "NEXT_REDIRECT") {
      throw e;  // 讓 redirect 通過
    }
    if (e.type === "CredentialsSignin" || e?.code === "credentials") {
      return { error: "Email 或密碼錯誤" };
    }
    throw e;
  }
  return { success: "登入成功" };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}