"use client"

import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { useSession } from "next-auth/react"

// SwitchRoleButton 컴포넌트 정의
export default function SwitchRoleButton({ isSeller }: { isSeller: boolean }) {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // 역할 전환 처리 함수
  const handleSwitchRole = async () => {
    try {
      setLoading(true)

      // 세션이 null인지 체크
      if (!session) {
        alert("세션 정보가 없습니다. 다시 로그인해 주세요.")
        return
      }

      const userId = session.user.id

      if (isSeller) {
        // 사용자로 전환
        const response = await axios.post("/api/switch-to-user")
        console.log("API 응답:", response.data)

        alert(response.data.message || "사용자 전환이 완료되었습니다.")
        await update()
        window.location.href = "/users/mypage" // 사용자 마이페이지로 이동
      } else {
        // 판매자로 전환
        const response = await axios.post("/api/upgrade-to-seller", { userId })
        console.log("API 응답:", response.data)

        alert(response.data.message || "판매자 전환이 완료되었습니다.")
        await update()
        window.location.href = "/seller/mypage" // 판매자 마이페이지로 이동
      }
    } catch (error) {
      console.error("Error switching role:", error)
      alert("전환 중 문제가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSwitchRole}
      disabled={loading}
      className={`mt-4 p-3 ${isSeller ? "bg-blue-600" : "bg-blue-600"} text-white rounded`}
    >
      {loading
        ? "처리 중..."
        : isSeller
          ? "사용자로 전환하기"
          : "판매자로 전환하기"}
    </button>
  )
}
