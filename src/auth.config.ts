// Auth.js v5 config — Google OAuth + Email/Password
// 與 auth.ts 配對：config 是 Edge-safe，auth.ts 是 Node-only
import type { NextAuthConfig } from "next-auth";

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
        token.id = user.id;
        token.plan = (user as any).plan ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).plan = token.plan as string;
      }
      return session;
    },
  },
  providers: [], // 在 auth.ts 內加 providers（DB 需要 Node 環境）
} satisfies NextAuthConfig;