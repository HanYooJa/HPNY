import NextAuth, { NextAuthOptions } from "next-auth"
import prisma from "@/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"

// 특정 조건을 확인하는 함수 (예시)
function shouldUpgradeToSeller(user: any): boolean {
  // 여기에 사용자가 판매자로 업그레이드되어야 하는 조건을 추가
  // 예: 특정 이메일 도메인인지 확인하거나 특정 필드 값이 있는지 확인
  return user.someCondition // 이 부분은 실제 로직으로 대체
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 2,
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
    signIn: "/users/signin",
  },
  callbacks: {
    // 세션에 role 추가
    session: async ({ session, token }) => {
      console.log("Session Callback - Token: ", token) // 디버깅용 로그
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role || "USER", // 기본값을 설정하여 role이 항상 존재하도록 보장
        },
      }
    },
    // JWT에 role 추가 및 특정 조건에 따른 업그레이드
    jwt: async ({ user, token }) => {
      console.log("JWT Callback - User: ", user) // 디버깅용 로그
      console.log("JWT Callback - Token before update: ", token) // 디버깅용 로그

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        // 특정 조건 하에 업그레이드
        if (dbUser && shouldUpgradeToSeller(dbUser)) {
          // 조건 함수
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "SELLER" },
          })
        }

        // 업데이트된 사용자 역할 가져오기
        const updatedUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        token.sub = user.id
        token.role = updatedUser?.role || "USER" // JWT에 role을 추가하고 기본값을 설정
      }

      console.log("JWT Callback - Token after update: ", token) // 디버깅용 로그
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
