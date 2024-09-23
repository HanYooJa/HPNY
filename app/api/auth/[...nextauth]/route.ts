import NextAuth, { NextAuthOptions } from "next-auth"
import prisma from "@/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"

// 판매자 업그레이드 조건을 확인하는 함수
function shouldUpgradeToSeller(user: any): boolean {
  // 조건을 여기에 추가하세요
  return user.someConditionToUpgrade // 예: user.isEligibleToUpgrade
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 세션 만료 시간: 24시간
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
        id: token.sub || "", // token.sub가 undefined인 경우 빈 문자열로 대체
        role: typeof token.role === "string" ? token.role : "USER",
        isSeller: token.role === "SELLER",
        initialRole:
          typeof token.initialRole === "string" ? token.initialRole : "USER",
        email: token.email || "",
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (dbUser) {
          const isSeller = shouldUpgradeToSeller(user) // 업그레이드 조건 확인
          token.role = isSeller ? "SELLER" : "USER"
          token.initialRole = token.role
          token.email = dbUser.email || ""
        } else {
          token.role = "USER"
        }
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
