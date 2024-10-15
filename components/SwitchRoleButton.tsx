"use client"

import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function SwitchRoleButton({ isSeller }: { isSeller: boolean }) {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSwitchRole = async () => {
    if (!session) {
      alert("세션 정보가 없습니다. 다시 로그인해 주세요.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      if (isSeller) {
        // 판매자에서 사용자로 전환
        const response = await axios.post("/api/switch-to-user")
        if (response.status === 200) {
          alert(response.data.message || "사용자 전환이 완료되었습니다.")
          await update() // 세션 업데이트 후에 페이지 이동
          router.push("/users/mypage")
        } else {
          alert(response.data.error || "사용자 전환에 실패했습니다.")
        }
      } else {
        // 사용자에서 판매자로 전환
        const response = await axios.post("/api/upgrade-to-seller", {
          userId: session.user.id,
        })

        if (response.status === 200) {
          alert(response.data.message || "판매자 전환이 완료되었습니다.")
          await update() // 세션 업데이트 후에 페이지 이동
          router.push("/seller/mypage")
        } else {
          alert(response.data.error || "판매자 전환에 실패했습니다.")
        }
      }
    } catch (error: any) {
      alert("전환 중 문제가 발생했습니다. 다시 시도해 주세요.")
    } finally {
      setLoading(false)
    }
  }

  if (session?.user?.role === "SELLER" && isSeller) {
    return null
  }

  return (
    <button
      onClick={handleSwitchRole}
      disabled={loading}
      className={`mt-4 p-3 bg-blue-600 text-white rounded ${loading ? "opacity-50" : ""}`}
    >
      {loading
        ? "처리 중..."
        : isSeller
          ? "사용자로 전환하기"
          : "판매자로 전환하기"}
    </button>
  )
}
