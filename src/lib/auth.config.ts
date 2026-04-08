import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAuth = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAuthPage =
        nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

      if (isDashboard && !isAuth) return false;
      if (isAuthPage && isAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
  session: { strategy: "jwt" },
};
