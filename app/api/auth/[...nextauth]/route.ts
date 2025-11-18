import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findFirst({ where: { email: credentials.email } });
        if (user && (await bcrypt.compare(credentials.password!, user.password!))) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 15 * 60, updateAge: 5 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

// 🔹 đây mới là chỗ fix lỗi TypeScript
const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
