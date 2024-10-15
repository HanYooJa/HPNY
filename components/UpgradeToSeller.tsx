"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useEffect, useState } from "react"

export default function UpgradeToSeller() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEligible, setIsEligible] = useState(false)

  useEffect(() => {
    const checkRoleEligibility = async () => {
      if (session?.user?.role === "USER") {
        const canUpgrade = await checkInitialRole()
        setIsEligible(canUpgrade)
      }
    }

    if (status === "authenticated") {
      checkRoleEligibility()
    }
  }, [session, status])

  const checkInitialRole = async () => {
    if (!session?.user?.id) {
      return false
    }

    try {
      const { data } = await axios.get(
        `/api/user-role?userId=${session.user.id}`,
      )
      console.log("초기 역할 확인 결과:", data)
      return data.initialRole === "USER"
    } catch (error) {
      console.error("Failed to check initial role:", error)
      return false
    }
  }

  const handleUpgrade = async () => {
    try {
      if (!session?.user?.id) {
        throw new Error("User ID is not available.")
      }

      const response = await axios.post("/api/upgrade-to-seller", {
        userId: session.user.id,
      })

      alert(response.data.message)
      router.push("/seller/mypage")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("판매자 전환 실패:", error)
        alert(
          `판매자 전환에 실패했습니다: ${error.response?.data?.error || error.message}`,
        )
      } else if (error instanceof Error) {
        console.error("판매자 전환 실패:", error)
        alert(`판매자 전환에 실패했습니다: ${error.message}`)
      } else {
        console.error("판매자 전환 실패:", error)
        alert("판매자 전환에 실패했습니다: 알 수 없는 오류")
      }
    }
  }

  if (status === "loading") {
    return <p>로딩 중...</p>
  }

  return isEligible ? (
    <div>
      <h1>판매자로 전환</h1>
      <button onClick={handleUpgrade}>판매자로 업그레이드</button>
    </div>
  ) : (
    <p>처음부터 사용자로 로그인한 계정은 판매자로 전환할 수 없습니다.</p>
  )
}
