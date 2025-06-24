import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        arid: { label: "ARID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { arid, password } = credentials;

        // Check if user exists in DB
        const user = await prisma.user.findUnique({
          where: { arid: arid },
        });

        if (!user) return null;

        // Simple plain text password check (Improve with bcrypt in production)
        if (user.password !== password) return null;

        return {
          id: user.id.toString(),
          arid: user.arid,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.arid = user.arid;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.arid = token.arid;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Optional: custom login page
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
