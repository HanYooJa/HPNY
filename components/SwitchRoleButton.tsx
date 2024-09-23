"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// RoleUpgrade 컴포넌트 정의
export default function RoleUpgrade() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      if (session.user.role === "SELLER") {
        router.push("/seller/mypage") // 판매자 마이페이지로 이동
      } else {
        router.push("/users/mypage") // 사용자 마이페이지로 이동
      }
    }
  }, [session, router])

  return null // 렌더링할 필요 없음
}
