"use client"
import axios from "axios"
import { useState } from "react"

export default function RoleUpgradeButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await axios.post("/api/upgrade-to-seller", { userId })

      if (response.status === 200) {
        alert("성공적으로 판매자로 업그레이드되었습니다.")
      }
    } catch (error) {
      console.error("판매자 업그레이드 실패:", error)

      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : (error as Error).message || "알 수 없는 오류가 발생했습니다."

      alert(`업그레이드에 실패했습니다: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      className="bg-blue-500 text-white p-2 rounded"
      disabled={loading}
    >
      {loading ? "업그레이드 중..." : "판매자로 업그레이드"}
    </button>
  )
}
