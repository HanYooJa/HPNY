// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import prisma from "@/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"

// 판매자 업그레이드 조건을 확인하는 함수
function shouldUpgradeToSeller(user: any): boolean {
  // 실제 로직으로 대체: 예를 들어 특정 이메일 도메인 사용
  return user.email?.endsWith("@example.com")
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
    // 세션에 role 추가
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role || "USER", // role 기본값 설정
        },
      }
    },
    // JWT에 role 추가 및 특정 조건에 따른 업그레이드
    jwt: async ({ user, token }) => {
      if (user) {
        // 데이터베이스에서 사용자의 현재 정보 가져오기
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (dbUser) {
          // 특정 조건에 따라 SELLER로 업그레이드
          if (shouldUpgradeToSeller(dbUser) && dbUser.role !== "SELLER") {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "SELLER" },
            })
            token.role = "SELLER" // 토큰에 업데이트된 역할을 반영
          } else {
            token.role = dbUser.role || "USER" // role을 항상 토큰에 반영
          }
          token.sub = user.id
        }
      }

      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
