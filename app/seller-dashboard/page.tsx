"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import RoleUpgradeButton from "@/components/RoleUpgradeButton" // RoleUpgradeButton 경로 확인 필요

export default function SellerDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentRole, setCurrentRole] = useState<"USER" | "SELLER">("SELLER")

  useEffect(() => {
    // 권한이 없는 사용자를 리디렉션
    if (
      status === "authenticated" &&
      session?.user?.role !== "SELLER" &&
      session?.user?.role !== "ADMIN"
    ) {
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

  // 세션이 유효하고 사용자가 판매자이거나 관리자일 경우 대시보드 표시
  if (
    status === "authenticated" &&
    (session?.user?.role === "SELLER" || session?.user?.role === "ADMIN")
  ) {
    return (
      <div>
        <h1>
          {currentRole === "SELLER" ? "판매자 대시보드" : "사용자 마이페이지"}
        </h1>
        <p>여기는 판매자만 접근할 수 있는 페이지입니다.</p>

        {/* 판매자 또는 관리자 역할 전환 버튼 */}
        <div className="my-4">
          <button
            onClick={() => setCurrentRole("USER")}
            className={`p-2 m-2 ${currentRole === "USER" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          >
            사용자로 변환
          </button>
          <button
            onClick={() => setCurrentRole("SELLER")}
            className={`p-2 m-2 ${currentRole === "SELLER" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          >
            판매자로 변환
          </button>
        </div>

        {/* 판매자 업그레이드 버튼 - 관리자만 볼 수 있음 */}
        {session?.user.role === "ADMIN" && (
          <RoleUpgradeButton userId={session.user.id} />
        )}

        {/* 현재 역할에 따른 콘텐츠 표시 */}
        {currentRole === "SELLER" ? (
          <div>판매자 전용 기능 및 정보</div>
        ) : (
          <div>사용자 전용 정보 및 기능</div>
        )}
      </div>
    )
  }

  // 세션이 아직 로딩 중이거나 인증되지 않은 경우 빈 페이지를 반환하여 렌더링을 막음
  return null
}
