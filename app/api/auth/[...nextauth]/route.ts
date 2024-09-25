import NextAuth, { NextAuthOptions } from "next-auth"
import prisma from "@/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"

// 판매자 업그레이드 조건을 확인하는 함수
function shouldUpgradeToSeller(user: any): boolean {
  return user.role === "SELLER" // 조건을 role 값에 기반하여 설정
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
    // 세션에 사용자 정보를 설정하는 콜백
    async session({ session, token }) {
      console.log("Session callback - token:", token) // 디버깅을 위해 로그 추가
      session.user = {
        ...session.user,
        id: token.sub || "",
        role: token.role || "USER", // role 정보를 토큰에서 가져옴
        isSeller: token.role === "SELLER",
        initialRole: token.initialRole || "USER",
        email: token.email || "",
      }
      return session
    },
    // JWT 토큰에 사용자 정보를 설정하는 콜백
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token
      }

      // 최초 로그인 시 실행
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (dbUser) {
          // 토큰에 역할 설정
          token.role = dbUser.role
          token.initialRole = dbUser.role
          token.email = dbUser.email || ""
        }
      } else {
        // 세션 갱신 시 데이터베이스에서 최신 role 가져오기
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        })

        if (dbUser) {
          token.role = dbUser.role // DB에서 가져온 최신 role 설정
        }
      }

      console.log("JWT callback - token:", token) // 디버깅을 위해 로그 추가
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
