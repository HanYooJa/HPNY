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
    try {
      setLoading(true)

      if (!session) {
        alert("세션 정보가 없습니다. 다시 로그인해 주세요.")
        return
      }

      if (isSeller) {
        const response = await axios.post("/api/switch-to-user")
        alert(response.data.message || "사용자 전환이 완료되었습니다.")
        await update()
        router.push("/users/mypage")
      } else {
        const response = await axios.post("/api/upgrade-to-seller", {
          userId: session.user.id,
        })

        if (response.status === 200) {
          alert(response.data.message || "판매자 전환이 완료되었습니다.")
          await update()
          router.push("/seller/mypage")
        } else {
          alert(response.data.error || "판매자 전환에 실패했습니다.")
        }
      }
    } catch (error: any) {
      alert("전환 중 문제가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // role이 USER일 때 버튼 숨기기
  if (session?.user?.role === "USER") {
    return null
  }

  return (
    <button
      onClick={handleSwitchRole}
      disabled={loading}
      className={`mt-4 p-3 bg-blue-600 text-white rounded`}
    >
      {loading
        ? "처리 중..."
        : isSeller
          ? "사용자로 전환하기"
          : "판매자로 전환하기"}
    </button>
  )
}
