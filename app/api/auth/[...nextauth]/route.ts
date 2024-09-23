// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import prisma from "@/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"

// 판매자 업그레이드 조건을 확인하는 함수
function shouldUpgradeToSeller(user: any): boolean {
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
    // 세션에 role과 initialRole 및 accessToken 추가
    async session({ session, token }) {
      console.log("Session callback - token:", token) // 디버그용
      console.log("Session callback - session:", session) // 디버그용

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role || "USER", // 현재 역할
          isSeller: token.role === "SELLER", // isSeller 값 추가
          initialRole: token.initialRole || token.role || "USER", // 초기 역할 설정
        },
        accessToken: token.accessToken, // accessToken 추가
      }
    },
    // JWT에 role, initialRole 및 accessToken 추가
    async jwt({ token, user, account }) {
      console.log("JWT callback - user:", user) // 디버그용
      console.log("JWT callback - token (before):", token) // 디버그용

      if (account) {
        token.accessToken = account.access_token // accessToken 저장
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (dbUser) {
          // 모든 사용자가 SELLER로 업그레이드 가능하도록 수정
          if (dbUser.role !== "SELLER" && shouldUpgradeToSeller(dbUser)) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "SELLER" },
            })
            token.role = "SELLER" // 토큰에 업데이트된 역할을 반영
          } else {
            token.role = dbUser.role || "USER" // role을 항상 토큰에 반영
          }

          token.sub = user.id

          // 최초 설정 시에만 initialRole을 설정 (이미 설정되어 있다면 변경하지 않음)
          if (!token.initialRole) {
            token.initialRole = dbUser.role || "USER"
          }
        }
      }

      console.log("JWT callback - token (after):", token) // 디버그용
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
