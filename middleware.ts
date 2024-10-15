import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // 토큰이 없는 경우 접근 불가
      if (!token) return false

      // SELLER인 경우 판매자 전용 경로 접근 허용
      if (token.role === "SELLER") return true

      // USER인 경우 일반 사용자 전용 경로 접근 허용
      if (token.role === "USER") return true

      // 그 외의 경우 접근 불가
      return false
    },
  },
})

export const config = {
  matcher: [
    "/users/mypage",
    "/users/info",
    "/users/edit",
    "/users/likes",
    "/users/comments",
    "/users/bookings/:path*",
    "/payments/:path*",
    "/rooms/register/:path",
    "/users/rooms",
    "/api/seller/:path*",
  ],
}
