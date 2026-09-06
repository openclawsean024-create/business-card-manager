// Auth.js v5 config — Google OAuth + Email/Password
// 與 auth.ts 配對：config 是 Edge-safe，auth.ts 是 Node-only
import type { NextAuthConfig } from "next-auth";

type AppUser = { id?: string; plan?: string };
type AppToken = { id?: string; plan?: string } & Record<string, unknown>;
type AppSessionUser = { id?: string; plan?: string } & Record<string, unknown>;

export default {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      // 保護的路由
      const protectedPaths = ["/dashboard", "/cards", "/settings"];
      const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));
      if (isProtected) return !!auth?.user;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as AppUser;
        (token as AppToken).id = u.id;
        (token as AppToken).plan = u.plan ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const t = token as AppToken;
        (session.user as unknown as AppSessionUser).id = t.id;
        (session.user as unknown as AppSessionUser).plan = t.plan;
      }
      return session;
    },
  },
  providers: [], // 在 auth.ts 內加 providers（DB 需要 Node 環境）
} satisfies NextAuthConfig;