"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function UpgradeToSeller() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleUpgrade = async () => {
    try {
      if (!session?.user?.id) {
        throw new Error("User ID is not available.")
      }

      // API를 호출하여 판매자로 업그레이드
      const response = await axios.post("/api/upgrade-to-seller", {
        userId: session.user.id,
      })

      alert(response.data.message)

      // 성공적으로 업그레이드되면 판매자 마이페이지로 이동
      router.push("/seller/mypage")
    } catch (error) {
      // AxiosError인지 확인
      if (axios.isAxiosError(error)) {
        console.error("판매자 전환 실패:", error)
        alert(
          `판매자 전환에 실패했습니다: ${error.response?.data?.error || error.message}`,
        )
      } else if (error instanceof Error) {
        // 일반 JavaScript 에러인 경우
        console.error("판매자 전환 실패:", error)
        alert(`판매자 전환에 실패했습니다: ${error.message}`)
      } else {
        // 알 수 없는 에러인 경우
        console.error("판매자 전환 실패:", error)
        alert("판매자 전환에 실패했습니다: 알 수 없는 오류")
      }
    }
  }

  return (
    <div>
      <h1>판매자로 전환</h1>
      <button onClick={handleUpgrade}>판매자로 업그레이드</button>
    </div>
  )
}
