import NextAuth, { NextAuthOptions } from "next-auth"
import prisma from "@/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24시간 세션 유지
    updateAge: 60 * 60 * 2, // 2시간마다 세션 갱신
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/users/signin", // 로그인 페이지 설정
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub || "",
        role: token.role || "USER",
        isSeller: token.role === "SELLER",
        initialRole: token.initialRole || "USER",
        email: token.email || "",
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        if (user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (dbUser) {
            token.role = dbUser.role
            token.initialRole = dbUser.role
          }
        }
      }

      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }

      return token
    },
  },
}

export default NextAuth(authOptions)
