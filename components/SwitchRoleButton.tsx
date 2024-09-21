"use client"

import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { useSession } from "next-auth/react"

// SwitchRoleButton 컴포넌트 정의
export default function SwitchRoleButton({ isSeller }: { isSeller: boolean }) {
  const { data: session, update } = useSession() // 세션 정보 가져오기
  const router = useRouter() // 라우터 초기화
  const [loading, setLoading] = useState(false) // 로딩 상태 관리

  // 역할 전환 처리 함수
  const handleSwitchRole = async () => {
    try {
      setLoading(true) // 로딩 상태 시작

      // 세션이 null인지 체크
      if (!session) {
        alert("세션 정보가 없습니다. 다시 로그인해 주세요.")
        return
      }

      const userId = session.user.id // 현재 세션의 사용자 ID 가져오기

      if (!isSeller) {
        // 판매자로 전환
        const response = await axios.post("/api/upgrade-to-seller", { userId })
        console.log("API 응답:", response.data) // API 응답 로그 추가

        alert(response.data.message || "판매자 전환이 완료되었습니다.")
        await update() // 세션 업데이트
        router.push("/seller/mypage") // 판매자 마이페이지로 이동
      } else {
        // 사용자로 전환
        const response = await axios.post("/api/switch-to-user")
        console.log("API 응답:", response.data) // API 응답 로그 추가

        alert(response.data.message || "사용자 전환이 완료되었습니다.")
        await update() // 세션 업데이트
        router.push("/users/mypage") // 사용자 마이페이지로 이동
      }
    } catch (error) {
      console.error("Error switching role:", error)
      alert("전환 중 문제가 발생했습니다.")
    } finally {
      setLoading(false) // 로딩 상태 종료
    }
  }

  return (
    <button
      onClick={handleSwitchRole} // 버튼 클릭 시 역할 전환 함수 호출
      disabled={loading} // 로딩 중 버튼 비활성화
      className={`mt-4 p-3 ${isSeller ? "bg-green-600" : "bg-blue-600"} text-white rounded`}
    >
      {loading
        ? "처리 중..." // 로딩 중일 때 텍스트
        : isSeller
          ? "사용자로 전환하기" // 판매자일 때
          : "판매자로 전환하기"}{" "}
      {/* 사용자일 때 */}
    </button>
  )
}
