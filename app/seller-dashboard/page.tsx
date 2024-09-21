"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function SellerDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // 권한이 없는 사용자를 리디렉션
    if (status === "authenticated" && session?.user?.role !== "SELLER") {
      router.replace("/")
    }

    if (status === "unauthenticated") {
      // 인증되지 않은 사용자를 로그인 페이지로 리디렉션
      router.replace("/users/signin")
    }
  }, [session, status, router])

  // 로딩 중 상태 처리
  if (status === "loading") {
    return <p>로딩 중...</p>
  }

  // 세션이 유효하고 사용자가 판매자인 경우 대시보드 표시
  if (status === "authenticated" && session?.user?.role === "SELLER") {
    return (
      <div>
        <h1>판매자 대시보드</h1>
        <p>여기는 판매자만 접근할 수 있는 페이지입니다.</p>
      </div>
    )
  }

  // 세션이 아직 로딩 중이거나 인증되지 않은 경우 빈 페이지를 반환하여 렌더링을 막음
  return null
}
